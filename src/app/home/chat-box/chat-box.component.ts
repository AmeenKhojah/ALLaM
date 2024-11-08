import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
  messages: any[] = [];

  constructor(private chatService: ChatService,
    private sanitizer: DomSanitizer,
    public cdr:ChangeDetectorRef) { }

  ngOnInit() {
    this.chatService.messages$.subscribe(updatedMessages => {
      this.messages = updatedMessages;
    });
  }

}