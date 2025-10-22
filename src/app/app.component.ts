import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import ielts from '../assets/det/output.json';
import deployTime from '../assets/det/deploy_time.json';
import { WordService } from './services/word.service';

interface Word {
  id: number;
  en1: string;
  en2: string;
  en3: string;
  en4: string;
  vn1: string;
  speakSentenceCountMax?: number;
  speakWordCountMax?: number;
  page?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showEn = true;
  showVN = false;
  no = 1;
  vnWord1 = '';
  enWord1 = '';
  enWord2 = '';
  enWord3 = '';
  enWord4 = '';
  page = 0;
  textxtx = '';
  words: Word[] = [];
  learnedWords: Word[] = [];
  countSawWords = 0;
  tempWord: any;
  deployT = deployTime.time;
  isAuto = false;
  timeSleep = 1000;

  selectedWord: Word = {
    id: 0,
    en1: '',
    en2: '',
    en3: '',
    en4: '',
    vn1: '',
    speakSentenceCountMax: 0,
    speakWordCountMax: 0,
    page: 0,
  };

  // speak
  selectedVoice: SpeechSynthesisVoice | null = null;
  voices: SpeechSynthesisVoice[] = [];
  selectedRate: number = 1;
  canSpeak: boolean = true;

  constructor(private wordService: WordService, private cdr: ChangeDetectorRef) {
    this.wordService.getWords().subscribe({
      next: data => {
        // API
        this.words = data;
        this.setupWord();
      },
      error: err => {
        // Deploy
        console.error('Error fetching words:', err);
        this.words = this.words.concat(ielts);
        this.learnedWords = this.words.splice(10, 30);
        this.setupWord();
      }
    });
  };

  ngOnInit(): void {
    this.voices = speechSynthesis.getVoices().filter(x => x.lang === "en-US");
    setTimeout(() => {
      this.voices = speechSynthesis.getVoices().filter(x => x.lang === "en-US");
      if (this.voices.length >= 29) {
        this.selectedVoice = this.voices[28];
      } else {
        this.selectedVoice = this.voices[0];
      }
    }, 500);
  };

  setupWord(): void {
    this.tempWord = this.removeRandomElement(this.words)
    this.words = this.shuffleItems(this.tempWord.updatedArray);

    if (this.tempWord.removedElement) {
      this.selectedWord = this.tempWord.removedElement;
      this.vnWord1 = this.tempWord.removedElement.vn1;
      this.enWord1 = this.tempWord.removedElement.en1;
      this.enWord2 = this.tempWord.removedElement.en2;
      this.enWord3 = this.tempWord.removedElement.en3;
      this.enWord4 = this.tempWord.removedElement.en4;
      this.speakSentenceCountMax = this.tempWord.removedElement.speakSentenceCountMax;
      this.speakWordCountMax = this.tempWord.removedElement.speakWordCountMax;
      this.page = this.tempWord.removedElement.page;
      this.learnedWords.push(this.tempWord.removedElement);
    } else {
      this.selectedWord = {
        id: 0,
        en1: '',
        en2: '',
        en3: '',
        en4: '',
        vn1: '',
        speakSentenceCountMax: 0,
        speakWordCountMax: 0,
      };
      this.vnWord1 = "";
      this.enWord1 = "";
      this.enWord2 = "";
      this.enWord3 = "";
      this.enWord4 = "";
      this.page = 0;
    };
  };

  shuffleItems<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  // API
  markAsStudied(id: number): void {
    this.wordService.markStudied(id).subscribe({
      next: () => {
      },
      error: err => console.error('Error updating studied status:', err)
    });
  };

  renderEnWord = (value: string): string => {
    if (!this.showVN) {
      let words = value.split(',');
      return words[0];
    };
    return value;
  };

  change() {
    if (!this.showVN) {
      this.showVN = true;
    };
    if (!this.showEn) {
      this.showEn = true;
    };
    this.cdr.detectChanges();
  };

  next() {
    this.markAsStudied(this.selectedWord.id)
    this.textxtx = '';
    this.countSawWords += 1;
    this.no = this.no * -1;
    this.showVN = this.no > 0;

    // this.see = !this.show; // Chỉ xuất hiện tiếng anh trước
    this.showVN = false;
    this.showEn = true;

    this.setupWord();
    this.cdr.detectChanges();
  };

  removeRandomElement<T>(arr: T[]): { updatedArray: T[], removedElement: T | undefined } {
    if (arr.length === 0) {
      return { updatedArray: arr, removedElement: undefined };
    };
    const randomIndex = Math.floor(Math.random() * arr.length);
    const removedElement = arr[randomIndex];
    arr.splice(randomIndex, 1);
    return { updatedArray: arr, removedElement };
  };

  deleteLearnedWord(id: any) {
    this.learnedWords = this.learnedWords.filter(word => word.id !== id);
    this.cdr.detectChanges();
  }

  speakWordCount = 0;
  speakWordCountMax = 1;
  async speakWord() {
    this.speakWordCount += 1;
    var utterance = new SpeechSynthesisUtterance(this.enWord1);
    utterance.lang = 'en-US';
    utterance.voice = this.selectedVoice;
    utterance.rate = this.selectedRate;
    if (this.isAuto) {
      utterance.onend = async (event) => {
        if (this.speakWordCount > this.speakWordCountMax) {
          this.speakWordCount = 0;
          this.change();
          await this.sleep();
          await this.speakSentence();
        } else {
          await this.sleep();
          await this.speakWord();
        };
      };
    };
    speechSynthesis.speak(utterance);
  };

  speakSentenceCount = 0;
  speakSentenceCountMax = 5;
  async speakSentence() {
    this.speakSentenceCount += 1;
    var utterance = new SpeechSynthesisUtterance(this.enWord2);
    utterance.lang = 'en-US';
    utterance.voice = this.selectedVoice;
    utterance.rate = this.selectedRate;
    if (this.isAuto) {
      utterance.onend = async (event) => {
        if (this.speakSentenceCount > this.speakSentenceCountMax) {
          this.speakSentenceCount = 0;
          this.next();
          await this.sleep();
          await this.speakWord();
        } else {
          await this.sleep();
          await this.speakSentence();
        };
      };
    };
    speechSynthesis.speak(utterance);
  };

  checkAbleSpeak() {
    this.voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang == 'en-US');
    if (this.voices.length > 0) {
      this.selectedVoice = this.voices[0];
      this.canSpeak = true;
    };
  };

  sleep(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.timeSleep));
  };
}
