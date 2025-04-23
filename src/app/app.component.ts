import { Component, OnInit, OnDestroy } from '@angular/core';

import ielts from '../assets/det/words.json';

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
  countMax = 20;
  count4Speaking = 20;

  selectedWord: Word = {
    id: 0,
    en1: '',
    en2: '',
    en3: '',
    en4: '',
    vn1: '',
  };

  // speak
  selectedVoice: SpeechSynthesisVoice | null;
  voices: SpeechSynthesisVoice[];
  selectedRate: number = 1;
  canSpeak: boolean = true;

  constructor() {
    this.selectedVoice = null;
    this.voices = [];
    this.selectedRate = 1;
    // this.words = this.words.concat(ielts, others);
    this.words = this.words.concat(ielts);
    this.id = this.getRandomArbitrary(this.minId, this.maxId);
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
    this.textxtx = '';
    this.count4Speaking = this.countMax;
    this.countSawWords += 1;
    this.no = this.no * -1;
    this.showVN = this.no > 0;

    // this.see = !this.show; // Chỉ xuất hiện tiếng anh trước
    this.showVN = false;
    this.showEn = true;

    this.id = this.getRandomArbitrary(this.minId, this.maxId);
    // let word = this.words.find((obj) => {
    //   return obj.id === this.id;
    // });
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

  removeRandomElement<T>(arr: T[]): { updatedArray: T[], removedElement: T | undefined } {
    if (arr.length === 0) {
      return { updatedArray: arr, removedElement: undefined };
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    const removedElement = arr[randomIndex];
    arr.splice(randomIndex, 1);
    return { updatedArray: arr, removedElement };
  }

  getRandomArbitrary(min: number, max: number) {
    while (true) {
      let newId = Math.floor(Math.random() * (max - min + 1)) + min;
      if (newId != this.id) {
        return newId;
      }
    }
  }

  speakMessage() {
    let words = this.enWord1.split(',');
    if (words.length > 0) {
      var utterance = new SpeechSynthesisUtterance(words[0].trim());
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
