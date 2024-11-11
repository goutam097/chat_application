import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  private apiUrl = 'http://localhost:5000';  
  constructor(private http: HttpClient) {}

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages`);
  }

  // Send new message
  sendMessage(message: string): Observable<any> {
    const body = { senderId: 'YOUR_USER_ID', receiverId: 'RECEIVER_USER_ID', message };
    return this.http.post<any>(`${this.apiUrl}/messages`, body);
  }
  
}
