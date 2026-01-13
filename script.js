document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES ---
    const triggerOpen = document.getElementById('trigger-open');
    const stageEnvelope = document.getElementById('envelope-stage');
    const collageContent = document.getElementById('collage-content');
    const overlay = document.getElementById('opening-overlay');
    const mainSite = document.getElementById('main-website');
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    
    // NUEVO: Referencia al botón flotante (EL ÚNICO QUE USAMOS AHORA)
    const enterFloatingBtn = document.getElementById('enter-site-floating');

    let isMusicPlaying = false;
    let isOpened = false;

    // --- CONTROL MÚSICA ---
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            isMusicPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
                isMusicPlaying = true;
            }).catch(e => console.log("Audio play blocked"));
        }
    });

    // --- ABRIR SOBRE ---
    triggerOpen.addEventListener('click', () => {
        if(isOpened) return;
        isOpened = true;
        
        // Iniciar música si no está sonando
        if(!isMusicPlaying) musicBtn.click(); 

        // Ocultar sobre cerrado
        stageEnvelope.style.opacity = '0';
        stageEnvelope.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            stageEnvelope.style.display = 'none';
            collageContent.classList.remove('hidden-content');
            collageContent.classList.add('visible-content');
            
            // MOSTRAR BOTÓN FLOTANTE
            if(enterFloatingBtn) {
                enterFloatingBtn.classList.remove('hidden-btn');
                enterFloatingBtn.classList.add('fade-in-btn');
            }

            // Scroll suave
            setTimeout(() => {
                window.scrollBy({ top: 100, behavior: 'smooth' });
            }, 800);
        }, 500); 
    });

    // --- TRANSICIÓN AL SITIO PRINCIPAL ---
    const goToSite = () => {
        // 1. Desvanecer Overlay
        overlay.style.opacity = '0';
        
        // 2. Manejar el botón flotante
        if(enterFloatingBtn) {
            // [CLAVE] Removemos la clase de animación que tiene el "!important"
            enterFloatingBtn.classList.remove('fade-in-btn');
            
            // Ahora sí aplicamos el desvanecimiento manual
            enterFloatingBtn.style.transition = "opacity 0.5s ease"; // Aseguramos transición suave
            enterFloatingBtn.style.opacity = '0';
            enterFloatingBtn.style.pointerEvents = 'none'; // Evita doble click mientras desaparece
        }

        // 3. Esperar la animación y mostrar el sitio
        setTimeout(() => {
            overlay.style.display = 'none';
            
            if(enterFloatingBtn) {
                // Ahora sí el display none funcionará porque ya no tiene la clase fade-in-btn
                enterFloatingBtn.style.display = 'none'; 
            }

            mainSite.classList.remove('hidden-site');
            mainSite.classList.add('visible');
        }, 1000);
    };

    // Escuchar click en el NUEVO botón flotante
    if(enterFloatingBtn) {
        enterFloatingBtn.addEventListener('click', goToSite);
    }
    
    // (NOTA: Ya no escuchamos al 'enter-site-btn' viejo porque lo borramos del HTML)


    // ============================================================
    // 2. LÓGICA RSVP (CÓDIGO EXISTENTE)
    // ============================================================
    
    const guestCodes = {
        'SOLO1': 1,
        'PAREJA2': 2,
        'FAMILIA3': 3,
        'FAMILIA4': 4,
        'FAMILIA5': 5,
        'FAMILIA6': 6
    };

    const rsvpInput = document.getElementById('rsvp-code-input');
    const rsvpCheckBtn = document.getElementById('rsvp-check-btn');
    const rsvpLoginView = document.getElementById('rsvp-login-view');
    const rsvpFormView = document.getElementById('rsvp-form-view');
    const rsvpSuccessMsg = document.getElementById('rsvp-success-msg');
    const rsvpErrorMsg = document.getElementById('rsvp-error-msg');
    const dynamicContainer = document.getElementById('dynamic-guests-container');
    const rsvpForm = document.getElementById('rsvp-form');

    if(rsvpCheckBtn) {
        rsvpCheckBtn.addEventListener('click', () => {
            const code = rsvpInput.value.trim().toUpperCase(); 

            if (guestCodes.hasOwnProperty(code)) {
                const numGuests = guestCodes[code];
                generateFormFields(numGuests);
                rsvpLoginView.style.display = 'none';
                rsvpFormView.classList.remove('rsvp-hidden');
                rsvpFormView.classList.add('fade-in-up'); 
            } else {
                rsvpErrorMsg.style.display = 'block';
                rsvpInput.style.borderColor = 'red';
            }
        });
    }

    function generateFormFields(count) {
        dynamicContainer.innerHTML = ''; 
        for (let i = 1; i <= count; i++) {
            const guestHTML = `
                <div class="guest-block">
                    <h3 class="guest-counter-title">Invitado ${i}</h3>
                    <label class="input-label">Nombre Completo</label>
                    <input type="text" name="invitado_${i}_nombre" class="rsvp-input-style" placeholder="Nombre y Apellido" required>
                    <label class="input-label">¿Asistirá?</label>
                    <select name="invitado_${i}_asistencia" class="rsvp-select-style" required>
                        <option value="Si">Sí, asistiré</option>
                        <option value="No">No podré asistir</option>
                    </select>
                    <label class="input-label">Restricciones Alimenticias / Alergias</label>
                    <input type="text" name="invitado_${i}_alergias" class="rsvp-input-style" placeholder="Ej. Vegano, Alergia a nueces, Ninguna">
                    <label class="input-label">Email de Contacto</label>
                    <input type="email" name="invitado_${i}_email" class="rsvp-input-style" placeholder="email@ejemplo.com">
                    <label class="input-label">Teléfono</label>
                    <input type="tel" name="invitado_${i}_telefono" class="rsvp-input-style" placeholder="10 dígitos">
                </div>
            `;
            dynamicContainer.insertAdjacentHTML('beforeend', guestHTML);
        }
    }

    if(rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "ENVIANDO...";
            submitBtn.disabled = true;

            const formData = new FormData(rsvpForm);

            fetch(rsvpForm.action, {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    rsvpFormView.style.display = 'none';
                    rsvpSuccessMsg.classList.remove('rsvp-hidden');
                    rsvpSuccessMsg.classList.add('fade-in-up');
                } else {
                    alert("Hubo un problema al enviar. Por favor intenta de nuevo.");
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.log(error);
                alert("Hubo un error de conexión. Por favor revisa tu internet.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});