import {  Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  messages: any[] = [];


  constructor(private chatService: ChatService, private http: HttpClient) { }

 async ngOnInit() {
    this.chatService.getToken();

    this.chatService.messages$.subscribe(updatedMessages => {
      this.messages = updatedMessages;
    });

    this.chatService.showToken()

  }
  clearChat() {
      this.chatService.clearMessages()
      console.log(this.chatService.getMessages());
  }

}