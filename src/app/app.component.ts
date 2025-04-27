import { Component, OnInit, OnDestroy } from '@angular/core';

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
  id = 1;
  minId = 0;
  maxId = ielts.length - 1;
  vnWord1 = '';
  enWord1 = '';
  enWord2 = '';
  enWord3 = '';
  enWord4 = '';
  textxtx = '';
  words: Word[] = [];
  countSawWords = 0;
  tempWord: any;
  countMax = 10;
  count4Speaking = 10;
  deployT = deployTime.time;

  selectedWord: Word = {
    id: 0,
    en1: '',
    en2: '',
    en3: '',
    en4: '',
    vn1: '',
  };

  // speak
  selectedVoice: SpeechSynthesisVoice | null = null;
  voices: SpeechSynthesisVoice[] = [];
  selectedRate: number = 1;
  canSpeak: boolean = true;

  constructor(private wordService: WordService) {

    this.wordService.getWords().subscribe({
      next: data => {
        // API
        this.words = data;
        this.setupWord()
      },
      error: err => {
        // Deploy
        console.error('Error fetching words:', err);
        this.words = this.words.concat(ielts);
      }
    });
  }

  ngOnInit(): void {
    this.voices = speechSynthesis.getVoices().filter(x => x.lang === "en-US");
    setTimeout(() => {
      this.voices = speechSynthesis.getVoices().filter(x => x.lang === "en-US");
      this.selectedVoice = this.voices[0]
    }, 500);
  }

  setupWord(): void {
    this.tempWord = this.removeRandomElement(this.words)
    this.words = this.tempWord.updatedArray;

    if (this.tempWord.removedElement) {
      this.selectedWord = this.tempWord.removedElement;
      this.vnWord1 = this.tempWord.removedElement.vn1;
      this.enWord1 = this.tempWord.removedElement.en1;
      this.enWord2 = this.tempWord.removedElement.en2;
      this.enWord3 = this.tempWord.removedElement.en3;
      this.enWord4 = this.tempWord.removedElement.en4;
    } else {
      this.selectedWord = {
        id: 0,
        en1: '',
        en2: '',
        en3: '',
        en4: '',
        vn1: '',
      };
      this.vnWord1 = "";
      this.enWord1 = "";
      this.enWord2 = "";
      this.enWord3 = "";
      this.enWord4 = "";
    }
  }

  // API
  markAsStudied(id: number): void {
    this.wordService.markStudied(id).subscribe({
      next: () => {
      },
      error: err => console.error('Error updating studied status:', err)
    });
  }

  renderEnWord = (value: string): string => {
    if (!this.showVN) {
      let words = value.split(',');
      return words[0];
    }
    return value;
  };

  change() {
    if (!this.showVN) {
      this.showVN = true;
    }
    if (!this.showEn) {
      this.showEn = true;
    }
  }

  next() {
    // this.voices = speechSynthesis.getVoices();
    console.log("this.voices ", this.voices.filter(x => x.lang === "en-US"))
    this.markAsStudied(this.selectedWord.id)
    this.textxtx = '';
    this.count4Speaking = this.countMax;
    this.countSawWords += 1;
    this.no = this.no * -1;
    this.showVN = this.no > 0;

    // this.see = !this.show; // Chỉ xuất hiện tiếng anh trước
    this.showVN = false;
    this.showEn = true;

    this.setupWord();
  }

  removeRandomElement<T>(arr: T[]): { updatedArray: T[], removedElement: T | undefined } {
    if (arr.length === 0) {
      return { updatedArray: arr, removedElement: undefined };
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    const removedElement = arr[randomIndex];
    arr.splice(randomIndex, 1);
    return { updatedArray: arr, removedElement };
  }

  speakMessage() {
    let words = this.enWord1.split(',');
    if (words.length > 0) {
      var utterance = new SpeechSynthesisUtterance(words[0].trim());
      utterance.lang = 'en-US';
      utterance.voice = this.selectedVoice;
      utterance.rate = this.selectedRate;
      speechSynthesis.speak(utterance);
    }
  }

  speakMessage2() {
    for (let index = 0; index < 2; index++) {
      this.speakMessage();
    }
  }

  speakSentence() {
    var utterance = new SpeechSynthesisUtterance(this.enWord2);
    utterance.lang = 'en-US';
    utterance.voice = this.selectedVoice;
    utterance.rate = this.selectedRate;
    speechSynthesis.speak(utterance);
  }

  speakSentence2() {
    for (let index = 0; index < 2; index++) {
      this.speakSentence();
    }
  }

  count() {
    if (this.count4Speaking !== 0) {
      this.count4Speaking = this.count4Speaking - 1
    }
  }

  checkAbleSpeak() {
    this.voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang == 'en-US');
    if (this.voices.length > 0) {
      this.selectedVoice = this.voices[0];
      this.canSpeak = true;
    }
  }

  // private intervalId: any;
  // ngOnInit(): void {
  //   this.intervalId = setInterval(() => this.runAction(), 3500);
  // }
  // ngOnDestroy(): void {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }
  // }
  // runAction(): void {
  //   if (this.showVN) {
  //     this.next();
  //     this.speakMessage();
  //   } else {
  //     this.change();
  //     this.speakMessage();
  //   }
  // }
}
