import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Preferences } from '@capacitor/preferences';
import { IonInput } from '@ionic/angular';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent implements OnInit {
  @ViewChild('input', { static: false }) tagInput!: IonInput
  tags: string[] = [];
  defaultQuestions: any[] = [  ]
  question=''
  isAddingTag = false;
  isSend: boolean = true;
  isLoading:boolean=false;

  newTag = '';
  promptText = '';

  constructor(private chatService: ChatService) { }

  ngOnInit() {
   this.loadQuestions()
   }
  async loadQuestions() {
    try {
      const { value } = await Preferences.get({ key: 'default-question' });
      if (value) {
        this.defaultQuestions = JSON.parse(value);
      } else {
        this.defaultQuestions = [
          { isDefault: true, isSelect: false, question: 'اريد منك تحسينات ومقترحات بناء على الاراء. اريدك ان تذكر 5 اراء الاكثر تكرارا بناء على السياق. اريد حصر الاراء السلبية. سوف اقدم لك عدد من الاراء في موضوع معين. عندما تقدم النتائج اريدك ان تجعلها بهذا الشكل:\n\nالأراء السلبية الأكثر تكرارا:\n1-\n2-\n3-\n\n(هنا ستكتب المقترحات لتحسين الاراء)' },
        ];
      }

    } catch (error) {
      console.error('Error loading questions from storage:', error);
      this.defaultQuestions = [];
    }
  }

  saveQuestion(event: KeyboardEvent) {
    if (event.key === 'Enter') {
     this.savePrompt()
    }
  }
 async savePrompt(){
    if (this.question.length > 0) {
      const questionObj = { question: this.question, isSelect: false, isDefault: false };
      this.defaultQuestions.push(questionObj);
      await Preferences.set({
        key:'default-question',
        value: JSON.stringify(this.defaultQuestions),
      });
      this.question = '';
    }
  }
async  toggleSelect(index: any) {
  this.defaultQuestions[index].isSelect = !this.defaultQuestions[index].isSelect;
    await Preferences.set({
      key: 'default-question',
      value: JSON.stringify(this.defaultQuestions),
    });
  }

  toggleTagInput() {
    this.isAddingTag = !this.isAddingTag;
    if (this.isAddingTag) {
      setTimeout(() => {
        this.tagInput.setFocus();
      }, 0);
    }

    if (this.newTag.trim().length > 0 && !this.tags.includes(this.newTag.trim())) {
      this.addTag();
    } else {
      this.newTag = '';
    }
  }
  onFocusOut() {
    this.addTagIfValid();
  }

  private addTagIfValid() {
    if (this.newTag.trim().length > 0 && !this.tags.includes(this.newTag.trim())) {
      this.addTag();
    }
    this.newTag = '';
  }

  addTag() {
    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
    this.isAddingTag = false;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addTag();
    }
  }

  sendOnEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.send();
    }
  }

  send() {
    if (this.promptText.trim() || this.tags.length > 0) {
      this.isLoading = true;
      this.chatService.saveMessage(this.promptText, [...this.tags], this.isSend, uuid());
      let prompt = this.promptText;
      let sentiment = '';
      const selectedQuestion = this.defaultQuestions.filter(q => q.isSelect === true);
      if (selectedQuestion.length>0) {
        sentiment =  selectedQuestion.map(p=>p.question).join('.');
      }
      let tag = this.tags
      this.tags =[]
      this.promptText = '';
      if (tag.length > 0) {

        this.chatService.getSuggesionFromTwitter(tag).subscribe((res: any) => {
          if (res) {
            let text = res.map((p: any) => p.fullText).join(' ')
            prompt = prompt + text;
          }
          this.promptText = '';
          this.tags = [];
          this.handlePrompt(prompt, sentiment);
        }, error => {
          this.promptText = '';
          this.tags = [];
          this.handlePrompt(prompt, sentiment);
        });
      } else {
        this.promptText = '';
        this.tags = [];
        this.handlePrompt(prompt, sentiment);
      }
    }
  }

  handlePrompt(prompt: string, sentiment:string) {

    if (prompt.length > 4000) {
      const chunks = this.splitIntoChunks(prompt, 4000);
      this.collectResponses(chunks, sentiment);
    } else {
      this.ask(prompt,sentiment, (response) => {
        this.isSend = false;
        this.chatService.saveMessage(response, [], this.isSend, uuid());
        this.isLoading = false;
        this.isSend = true;
        console.log('Response:', response);
      });
    }
  }

  splitIntoChunks(prompt: string, maxLength: number): string[] {
    const chunks = [];
    for (let i = 0; i < prompt.length; i += maxLength) {
      chunks.push(prompt.substring(i, i + maxLength));
    }
    return chunks;
  }


  collectResponses(chunks: string[], sentiment: string) {
    const responses: string[] = [];
    let completedRequests = 0;
    let uid = uuid();
    const processChunk = (index: number) => {
      if (index >= chunks.length) {
        this.handleFinalResponse(responses,uid);
        return;
      }

      
        this.ask(chunks[index], sentiment, (response) => {
          completedRequests++;
          if (response) {
            this.chatService.saveMessage(response, [], false,uid);
            // responses.push(response);
          }
        });

      setTimeout(() => {
        processChunk(index + 1);
      },1000);
    };

    processChunk(0);
  }


  async ask(prompt: string,sentiment:string, callback: (response: string) => void) {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      console.log('Prompt is empty');
      callback('');
      return;
    }

    try {
      const observable = await this.chatService.sendPromptToAlam(trimmedPrompt, sentiment);
      observable.subscribe(
        (response: any) => {
          if (response && response.results && response.results.length > 0) {
            const backResponse = response.results[0].generated_text;
            callback(backResponse);

            this.promptText = '';
            this.tags = [];
          } else {
            console.error('Error: Invalid response format');
            callback('');
          }
        },
        (error) => {
          console.error('Error while sending message', error);
          callback(error.message);
        }
      );
    } catch (error:any) {
      console.error('Error retrieving observable', error);
      callback(error.message);
    }
  }



  handleFinalResponse(responses: string[], uuid:string) {
    const finalResponse = responses.join(' ');
    this.isSend = false;
    this.chatService.saveMessage(finalResponse, [], this.isSend,uuid);
    this.isLoading = false;
    this.isSend = true;
    console.log('Combined Response:', finalResponse);
  }



  removeTag(tagIndex: number): void {
    this.tags.splice(tagIndex, 1);
  }

  async removePrompt(index:number){
    this.defaultQuestions.splice(index, 1);
    await Preferences.set({
      key:'default-question',
      value: JSON.stringify(this.defaultQuestions),
    });
  }

}