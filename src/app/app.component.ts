import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'palomasoaresfisio';

  nome = '';
  email = '';
  telefone = '';
  assunto = '';
  mensagem = '';

  whatsappNumero = '5579999225553';

  @ViewChild('offcanvasNavbar') offcanvasNavbar!: ElementRef;
  bsOffcanvas: any;
  private isBrowser: boolean;

  ano: number = new Date().getFullYear();

  private offcanvasInitialized = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

    // Intersection Observer para revelar elementos
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const bootstrap = await import('bootstrap');
    const offcanvasEl = this.offcanvasNavbar?.nativeElement;

    if (offcanvasEl) {
      document.querySelectorAll('.offcanvas-backdrop').forEach(el => el.remove());

      const oldInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (oldInstance) oldInstance.dispose();

      this.bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl, {
        backdrop: true,
        scroll: false,
      });

      let ignoreNextClickOutside = false;

      // Evento para pós-fechamento do offcanvas
      offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
        if (toggler) toggler.blur();
        document.body.style.overflow = '';
        ignoreNextClickOutside = true;

        // Limpa qualquer backdrop residual
        document.querySelectorAll('.offcanvas-backdrop').forEach(el => el.remove());
      });

      // Fechar offcanvas ao clicar fora dele
      document.addEventListener('mousedown', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const isInsideOffcanvas = offcanvasEl.contains(target);
        const isToggler = document.querySelector('.navbar-toggler')?.contains(target);
        if (this.bsOffcanvas && offcanvasEl.classList.contains('show') && !isInsideOffcanvas && !isToggler) {
          this.bsOffcanvas.hide();
        }
      });

      // Fechar offcanvas ao clicar em links do menu
      document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', (event) => {
          (event.currentTarget as HTMLElement).blur();
          this.bsOffcanvas.hide();
        });
      });
    }
  }

  enviarMensagemWhatsApp() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^[0-9]+$/;


    if (this.nome.trim().length < 3) {
      alert('Por favor, insira um nome com pelo menos 3 caracteres.');
      return;
    }

    if (!emailRegex.test(this.email)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    if (!telefoneRegex.test(this.telefone)) {
      alert('Telefone deve conter apenas números, parênteses, hífens, espaços e +.');
      return;
    }

    if (this.telefone.trim().length < 8 || this.telefone.trim().length > 15) {
      alert('Telefone deve ter entre 8 e 15 caracteres.');
      return;
    }

    if (this.assunto.trim().length < 3) {
      alert('Por favor, insira um assunto com pelo menos 3 caracteres.');
      return;
    }

    if (this.mensagem.trim().length < 10) {
      alert('A mensagem deve ter pelo menos 10 caracteres.');
      return;
    }

    const textoMensagem =
      `*Nome:* ${this.nome}%0A` +
      `*Email:* ${this.email}%0A` +
      `*Telefone:* ${this.telefone}%0A` +
      `*Assunto:* ${this.assunto}%0A` +
      `*Mensagem:* ${this.mensagem}`;

    const url = `https://api.whatsapp.com/send?phone=${this.whatsappNumero}&text=${textoMensagem}`;
    window.open(url, '_blank');
  }

  destacarItemMenu() {
    const sections = document.querySelectorAll("section[id]");
    let currentId = '';

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.scrollY - 120;
      const height = section.clientHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.id;
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      if (href === currentId) link.classList.add('active');
      else link.classList.remove('active');
    });
  }
}
