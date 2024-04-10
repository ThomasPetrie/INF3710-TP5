import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { EspeceOiseau } from '../../../../common/tables/EspeceOiseau';
import { Statut } from '../../../../common/tables/Statut';

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
  newOiseau: EspeceOiseau = { nomscientifique: 'Nom scientifique', nomcommun: 'Nom commun', statutspeces: "Statut d'espèce", nomscientifiquecomsommer: null };
  Statut = Statut;

  constructor(private communicationService: CommunicationService) { }

  ngOnInit(): void {
    this.getEspeces();
  }

  public changeCommun(event: any, i:number){
    const editField = event.target.textContent;
    this.especesOiseaux[i].nomcommun = editField;
  }

  public changeStatut(event: any, i:number){
    const editField = event.target.textContent;
    this.especesOiseaux[i].statutspeces = editField;
  }

  public updateHotel(i: number) {
    this.communicationService.updateEspece(this.especesOiseaux[i]).subscribe((res: any) => {
      this.refresh();
    });
  }

  private refresh() {
    this.getEspeces();
    this.newOiseau = { nomscientifique: 'Nom scientifique', nomcommun: 'Nom commun', statutspeces: "Statut d'espèce", nomscientifiquecomsommer: null };
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

  public addEspece(): void {
    this.communicationService.insertEspece(this.newOiseau).subscribe((res: any) => {
      this.refresh();
    })
  }

  public changeNewScien(event: any): void {
    const editField = event.target.textContent;
    this.newOiseau.nomscientifique = editField;
  }

  public changeNewCommun(event: any): void {
    const editField = event.target.textContent;
    this.newOiseau.nomcommun = editField;
  }

}
