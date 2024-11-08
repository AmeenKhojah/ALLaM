import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { SafePipe } from '../shared/safe.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SafePipe

  ],
  declarations: [
    HomePage,
    ChatBoxComponent,
    ChatInputComponent
  ]
})
export class HomePageModule {}