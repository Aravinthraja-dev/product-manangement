import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Menubar, BadgeModule, AvatarModule, InputTextModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  items: MenuItem[] | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => this.onHomeClick(),
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            badge: '3',
            items: [
                {
                    label: 'Core',
                    icon: 'pi pi-bolt',
                    shortcut: '⌘+S',
                },
                {
                    label: 'Blocks',
                    icon: 'pi pi-server',
                    shortcut: '⌘+B',
                },
                {
                    separator: true,
                },
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil',
                    shortcut: '⌘+U',
                },
            ],
        },
    ];
    }

    onHomeClick = () => {
        this.router.navigate(['/dashboard']);
    }

}
