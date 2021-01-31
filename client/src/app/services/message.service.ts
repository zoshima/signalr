import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private connection: signalR.HubConnection;
  private messagesSubject$: Subject<Message>;

  public messages$: Observable<Message>;

  constructor(private http: HttpClient) {
    this.messagesSubject$ = new Subject<Message>();
    this.messages$ = this.messagesSubject$.asObservable();

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/messagehub')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onclose(() => {
      console.log('connection broke');

      const pid: any = setInterval(async () => {
        const result: boolean = await this.start();

        if (result) {
          console.log('connection reestablished');
          clearInterval(pid);
        }
      }, 1000);
    });

    this.connection.on('MessagePosted', (message: Message) => {
      this.messagesSubject$.next(message);
    });

    this.start();
  }

  public async start(): Promise<boolean> {
    try {
      await this.connection.start();
      return true;
    } catch (err) {
      return false;
    }
  }

  public async send(message: Message): Promise<void> {
    await this.http
      .post('https://localhost:5001/messages', message)
      .toPromise();
  }
}
