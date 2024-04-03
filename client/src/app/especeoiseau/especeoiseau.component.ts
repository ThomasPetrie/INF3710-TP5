import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { EspeceOiseau } from '../../../../common/tables/EspeceOiseau';


@Component({
  selector: 'app-especeoiseau',
  templateUrl: './especeoiseau.component.html',
  styleUrls: ['./especeoiseau.component.css']
})
export class EspeceoiseauComponent implements OnInit {

  @ViewChild('newScientifique') newScientifique: ElementRef;
  @ViewChild('newCommun') newCommun: ElementRef;
  @ViewChild('newStatut') newStatut: ElementRef;
  @ViewChild('newPredator') newPredator: ElementRef;

  especesOiseaux : EspeceOiseau[] = [];

  constructor(private communicationService: CommunicationService) { }

  ngOnInit(): void {
    this.getEspeces();
  }

  public changeScientifique(event: any, i:number){
    const editField = event.target.textContent;
    this.especesOiseaux[i].nomscientifique = editField;
  }

  public changeCommun(event: any, i:number){
    const editField = event.target.textContent;
    this.especesOiseaux[i].nomcommun = editField;
  }

  public changeStatut(event: any, i:number){
    const editField = event.target.textContent;
    this.especesOiseaux[i].statutspeces = editField;
  }

  public changePredator(event: any, i:number){
    const editField = event.target.textContent;
    this.especesOiseaux[i].nomscientifiquecomsommer = editField;
  }

  public updateHotel(i: number) {
    this.communicationService.updateEspece(this.especesOiseaux[i]).subscribe((res: any) => {
      this.refresh();
    });
  }

  private refresh() {
    this.getEspeces();
    this.newScientifique.nativeElement.innerText = "";
    this.newCommun.nativeElement.innerText = "";
    this.newStatut.nativeElement.innerText = "";
    this.newPredator.nativeElement.innerText = "";
  }

  public getEspeces(): void {
    this.communicationService.getEspeces().subscribe((especes: EspeceOiseau[]) => {
      this.especesOiseaux = especes;
    });
  }

  public updateEspece(i: number): void {
    this.communicationService.updateEspece(this.especesOiseaux[i]).subscribe((res: any) => {
      this.refresh();
    })
  }

  public deleteEspece(nomscientifique: string){
    this.communicationService.deleteEspece(nomscientifique).subscribe((res: any) => {
      this.refresh();
    })
  }

}
