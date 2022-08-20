import { Component } from '@angular/core';
import wordList1 from '../assets/json/words1.json';
import wordList2 from '../assets/json/words2.json';
import wordList3 from '../assets/json/words3.json';
import wordList4 from '../assets/json/words4.json';
import wordList5 from '../assets/json/words5.json';
import wordList6 from '../assets/json/words6.json';
import wordList7 from '../assets/json/words7.json';
import wordList8 from '../assets/json/words8.json';
import wordList9 from '../assets/json/words9.json';
import wordList10 from '../assets/json/words10.json';
import wordList11 from '../assets/json/words11.json';
import wordList12 from '../assets/json/words12.json';
import wordList13 from '../assets/json/words13.json';
import wordList14 from '../assets/json/words14.json';
import wordList15 from '../assets/json/words15.json';
import wordList16 from '../assets/json/words16.json';
import wordList17 from '../assets/json/words17.json';
import wordList18 from '../assets/json/words18.json';
import wordList19 from '../assets/json/words19.json';
import wordList20 from '../assets/json/words20.json';
import wordList21 from '../assets/json/words21.json';
import wordList22 from '../assets/json/words22.json';
import wordList23 from '../assets/json/words23.json';
import wordList24 from '../assets/json/words24.json';
import wordList25 from '../assets/json/words25.json';
import wordList26 from '../assets/json/words26.json';
import wordList27 from '../assets/json/words27.json';
import wordList28 from '../assets/json/words28.json';
import wordList29 from '../assets/json/words29.json';
import wordList30 from '../assets/json/words30.json';
import wordList31 from '../assets/json/words31.json';
import wordList32 from '../assets/json/words32.json';
import wordList33 from '../assets/json/words33.json';
import wordList34 from '../assets/json/words34.json';
import wordList35 from '../assets/json/words35.json';
import wordList36 from '../assets/json/words36.json';
import wordList37 from '../assets/json/words37.json';
import wordList38 from '../assets/json/words38.json';
import wordList39 from '../assets/json/words39.json';
import wordList40 from '../assets/json/words40.json';
import wordList41 from '../assets/json/words41.json';
import wordList42 from '../assets/json/words42.json';
import wordList43 from '../assets/json/words43.json';
import wordList44 from '../assets/json/words44.json';
import wordList45 from '../assets/json/words45.json';
import wordList46 from '../assets/json/words46.json';
import wordList47 from '../assets/json/words47.json';
import wordList48 from '../assets/json/words48.json';
import wordList49 from '../assets/json/words49.json';
import wordList50 from '../assets/json/words50.json';
import others from '../assets/json/others.json';

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
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Up O
  show = true;
  see = false;
  no = 1;
  min = 1;
  max = 603;
  vnWord1 = '';
  vnWord2 = '';
  enWord1 = '';
  enWord2 = '';
  enWord3 = '';
  enWord4 = '';
  words: Word[] = [];
  countSawWords = 0;

  // speak
  selectedVoice: SpeechSynthesisVoice | null;
  voices: SpeechSynthesisVoice[];
  selectedRate: number = 1;
  canSpeak: boolean = false;

  constructor() {
    this.selectedVoice = null;
    this.voices = [];
    this.selectedRate = 1;

    this.words = this.words.concat(wordList1, wordList2, wordList3, wordList4, wordList5, wordList6, wordList7, wordList8, wordList9, wordList10, wordList11, wordList12, wordList13, wordList14, wordList15, wordList16, wordList17, wordList18, wordList19, wordList20, wordList21, wordList22, wordList23, wordList24, wordList25, wordList26, wordList27, wordList28, wordList29, wordList30, wordList31, wordList32, wordList33, wordList34, wordList35, wordList36, wordList37, wordList38, wordList39, wordList40, wordList41, wordList42, wordList43, wordList44, wordList45, wordList46, wordList47, wordList48, wordList49, wordList50, others);
    let id = this.getRandomArbitrary(this.min, this.max);
    let word = this.words.find((obj) => {
      return obj.id === id;
    });
    if (word) {
      this.vnWord1 = word.vn1;
      this.enWord1 = word.en1;
      this.enWord2 = word.en2;
      this.enWord3 = word.en3;
      this.enWord4 = word.en4;
    }
  }


  change() {
    if (!this.show) {
      this.show = true;
    }
    if (!this.see) {
      this.see = true;
    }
  }

  next() {
    this.countSawWords += 1;
    this.no = this.no * -1;
    this.show = this.no > 0;
    this.see = !this.show;
    let id = this.getRandomArbitrary(this.min, this.max)
    let word = this.words.find((obj) => {
      return obj.id === id;
    });
    if (word) {
      this.vnWord1 = word.vn1;
      this.enWord1 = word.en1;
      this.enWord2 = word.en2;
      this.enWord3 = word.en3;
      this.enWord4 = word.en4;
    }
  }

  getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  copyMessage() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.enWord1;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  speakMessage() {
    var utterance = new SpeechSynthesisUtterance(this.enWord1);
    utterance.voice = this.selectedVoice;
    utterance.rate = this.selectedRate;
    speechSynthesis.speak(utterance);
  }

  checkAbleSpeak() {
    this.voices = window.speechSynthesis.getVoices().filter(voice => voice.lang == "en-US");
    if (this.voices.length > 0) {
      this.selectedVoice = this.voices[0];
      this.canSpeak = true;
    }
  }

  selectVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }
}
