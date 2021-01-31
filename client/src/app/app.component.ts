import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from './models/message.model';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public messages: Message[];

  @ViewChild('messageInput', { static: true })
  private messageInput!: ElementRef;

  constructor(private messageService: MessageService) {
    this.messages = [];
  }

  public ngOnInit(): void {
    this.messageService.messages$.subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  public onSendClick(): void {
    const data: string = this.messageInput.nativeElement.value;

    this.messageService.send({
      data: data,
      date: new Date(),
    } as Message);

    this.messageInput.nativeElement.value = '';
  }
}
