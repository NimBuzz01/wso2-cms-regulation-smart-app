import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceService } from '../../service/insurance.service';
import { Patient } from '../../model/patient.model';
import jwt_decode from 'jwt-decode';
import { browser } from 'protractor';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [InsuranceService],
})
export class HeaderComponent implements OnInit {
  public showProfile: boolean = false;
  public showReqRes: boolean = false;
  patient = new Patient();
  constructor(
    private router: Router,
    private insuranceService: InsuranceService
  ) {}

  ngOnInit(): void {
    setTimeout( () => {
      this.getUsername();
    }, 3000);
  }

  getUsername() {
    const patientId = sessionStorage.getItem('patientId');
      this.insuranceService.getPatient(patientId).subscribe((res: any) => {
        this.patient.name = res.name[0].given[0] + res.name[0].family.charAt(0);
      });
  }

  toggleProfile() {
    //Hide and show my profile
    this.showProfile = !this.showProfile;
  }

  toggleReqRes() {
    //Hide and show my profile
    this.showReqRes = !this.showReqRes;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl("/"); 
  }


  openNav() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    sidebar?.classList.toggle('sidebar_small');
  }

  navigate() {
    // Route to My Claims page
    this.router.navigate(['/my-claims']);
  }
}
