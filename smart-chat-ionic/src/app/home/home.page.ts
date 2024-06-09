import { CustomValidators } from './../utils/custom-validators';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from '../models/message.model';
import { OpenaiService } from '../services/openai.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent, {static: false}) content!: IonContent;

  messages: Message[] = [];

  form = new FormGroup({
    prompt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace]) 
  });

  loading: boolean = false;

  constructor(
    private openAi: OpenaiService
  ) {}

  submit() {

    if(this.form.valid){

      let prompt = this.form.value.prompt as string;

    //===== Mensaje del usuario =======
    let userMsg: Message = { sender: 'me', content: prompt }
    this.messages.push(userMsg);

    //===== Mensaje del bot =======
    let botMsg: Message = { sender: 'bot', content: '' }
    this.messages.push(botMsg);

    this.scrollToBotton();
    this.form.reset();
    this.form.disable();

    this.loading = true;

    this.openAi.sendQuestion(prompt).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.messages[this.messages.length - 1].content = res.bot;
        this.form.enable();
      }, 
      error: (error: any) => {
        console.error('Error:', error);
        this.loading = false;
        this.form.enable();
      }
    });
      
    }

  }

  typeText(text: string) {
    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {
      if (textIndex < text.length) {
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++;
      } else {
        clearInterval(interval);
        this.scrollToBotton();
      }
    }, 15);
  }

  scrollToBotton() {
    this.content.scrollToBottom(2000);
  }
}
