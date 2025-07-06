import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
  ano: number = new Date().getFullYear();

  @ViewChild('offcanvasNavbar') offcanvasNavbar!: ElementRef;
  bsOffcanvas: any;

  private isBrowser: boolean;

  private cliqueFora = (event: MouseEvent) => {
    const offcanvasEl = this.offcanvasNavbar?.nativeElement;
    const target = event.target as HTMLElement;

    if (!offcanvasEl) return;

    const isInsideOffcanvas = offcanvasEl.contains(target);
    const isToggler = document.querySelector('.navbar-toggler')?.contains(target);

    if (this.bsOffcanvas && offcanvasEl.classList.contains('show') && !isInsideOffcanvas && !isToggler) {
      this.bsOffcanvas.hide();
    }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

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

      offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
        if (toggler) toggler.blur();
        document.body.style.overflow = '';
        document.querySelectorAll('.offcanvas-backdrop').forEach(el => el.remove());
      });

      document.addEventListener('mousedown', this.cliqueFora);

      document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', () => {
          (link as HTMLElement).blur();
          this.bsOffcanvas.hide();
        });
      });
    }

    const tooltipTriggerList = this.elementRef.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el: HTMLElement) => {
      new bootstrap.Tooltip(el);
    });
  }

  enviarMensagemWhatsApp() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^[0-9]+$/;
    const nomeRegex = /^[A-Za-zÀ-ÿ\s']+$/;

    if (this.nome.trim().length < 3 || !nomeRegex.test(this.nome.trim())) {
      alert('Por favor, insira um nome válido (somente letras, sem números).');
      return;
    }

    if (!emailRegex.test(this.email)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    if (!telefoneRegex.test(this.telefone)) {
      alert('Telefone deve conter apenas números.');
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

  ngOnDestroy() {
    if (this.isBrowser) {
      document.removeEventListener('mousedown', this.cliqueFora);
    }
  }
}
