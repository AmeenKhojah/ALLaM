import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<any[]>([]);
  
  messages$ = this.messagesSubject.asObservable();

  public tokenUrl = 'https://us-central1-cognitalk.cloudfunctions.net/GetToken';
  public alamURL = 'https://us-central1-cognitalk.cloudfunctions.net/sendPrompt';
  public apifyURL = 'https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=apify_api_IHuvX99Z05YokbYV5dOt9YU8DYwCKm4blir7';

  constructor(private http: HttpClient,) { }

  clearMessages(){
    this.messagesSubject.next([]);
    console.log('Messages cleared', this.messagesSubject);

  }

  saveMessage(message: string, tags: string[], isSend: boolean,id:string): void {
    let messages = this.messagesSubject.getValue();
    let index = messages.findIndex(p=>p.id == id);
    if(index>=0){
      messages[index].message = messages[index].message.replace(message,'');
      messages[index].message = messages[index].message + '<br> <br> -' + message;
    }
    else{
      messages = messages.filter(p=>p.message != message);
      messages = [...messages,{ message, tags, isSend, id }];
    }
    this.messagesSubject.next(messages);
  }

  getMessages(): any[] {
    return this.messagesSubject.getValue();;
  }

async showToken(){
  const token = await Preferences.get({ key: 'token' });
  return token
}


  async getToken() {
    this.http.get(this.tokenUrl).subscribe(async (response: any) => {
      if (response.access_token) {
        await Preferences.set({
          key: 'token',
          value: response.access_token,
        });
      } else {
        console.log('Token not found');
      }
    }, error => {
      console.log('Token not found');
    });
  }

 async sendPromptToAlam(prompt: string, sentiment: string) {
    let token:any = await Preferences.get({ key: 'token' });
    token = token && token.value ? token.value : '';
    let params = {
      prompt: prompt,
      sentiment: sentiment,
      token:token
    };
    return this.http.post(this.alamURL,params);
  }

  getSuggesionFromTwitter(tags: string[]) {
    tags = tags
      .filter(str => str.startsWith("#")) // Check if string starts with "#"
      .map(str => `${str} filter:hashtags`);
    let param = {
      "includeSearchTerms": false,
      "maxItems": 100,
      "onlyImage": false,
      "onlyQuote": false,
      "onlyTwitterBlue": false,
      "onlyVerifiedUsers": false,
      "onlyVideo": false,
      "searchTerms": tags,
      "sort": "Top",
      "tweetLanguage": "ar"
    }
    return this.http.post(this.apifyURL, param);
  }
}