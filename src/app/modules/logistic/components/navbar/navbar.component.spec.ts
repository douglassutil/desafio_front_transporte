import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';



describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'home/dashboard', component: NavbarComponent },
          { path: 'home/delivey', component: NavbarComponent },
        ])
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar with correct content', () => {
    const toolbarElement: HTMLElement = fixture.nativeElement;
    const anchorElement = toolbarElement.querySelector('a');
    expect(anchorElement).toBeTruthy();
    if (anchorElement) {
      expect(anchorElement.textContent).toContain('LOGÍSTICA');
    } else {
      fail('Anchor element not found');
    }
  });

  it('should contain correct menu items', () => {
    const menuButton = fixture.debugElement.query(By.css('.menu-button'));
    menuButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const menuItems = fixture.debugElement.queryAll(By.css('.mat-menu-custom button'));
    expect(menuItems.length).toBe(2);

    const dashboardMenuItem = menuItems[0].nativeElement;
    const deliveryMenuItem = menuItems[1].nativeElement;

    expect(dashboardMenuItem.textContent).toContain('Dashboard');
    expect(deliveryMenuItem.textContent).toContain('Lista de Entregas');
  });
  
  afterEach(() => {
    fixture.destroy();
  });
});
