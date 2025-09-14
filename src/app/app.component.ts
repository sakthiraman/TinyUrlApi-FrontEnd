import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

interface Tiny {
  id: number;
  code: string;
  originalUrl: string;
  isPrivate: boolean;
  clicks: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  baseApi = 'http://localhost:5000/api';
  url = '';
  isPrivate = false;
  list: Tiny[] = [];
  searchQ = '';

  constructor(private http: HttpClient) {
    this.load();
  }

  create() {
    this.http.post<any>(`${this.baseApi}/shorten`, { originalUrl: this.url, isPrivate: this.isPrivate })
      .subscribe(_ => { this.url=''; this.isPrivate=false; this.load(); });
  }

  load() {
    this.http.get<Tiny[]>(`${this.baseApi}/list`).subscribe(data => this.list = data);
  }

  deleteItem(id:number) {
    this.http.delete(`${this.baseApi}/${id}`).subscribe(()=> this.load());
  }

  copy(code:string) {
    const full = window.location.origin + '/' + code;
    navigator.clipboard.writeText(full);
    alert('Copied: ' + full);
  }

  search() {
    if (!this.searchQ) { this.load(); return; }
    this.http.get<Tiny[]>(`${this.baseApi}/search?q=${encodeURIComponent(this.searchQ)}`)
      .subscribe(data => this.list = data);
  }
}