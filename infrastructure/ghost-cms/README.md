The testing environment consists of a local Ghost CMS instance.
XSS attack tests were performed by creating Posts containing XSS payloads embedded within iframes (possibly nested) in a HTML section, in order to verify the effectiveness of the Trusted Types propagation handled by the extension.

Test 0:

<h3>Test Sicurezza</h3>
<div id="zona-test"></div>

<script>
  try {
     // Tentativo di XSS classico
     document.getElementById('zona-test').innerHTML = '<img src=x onerror=alert("XSS!")>';
  } catch(e) {
     console.log("Bloccato da Trusted Types!");
  }
</script>


Test 1:

<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; margin-bottom: 40px;">
    <h2 style="color: #2c3e50; margin-bottom: 10px;">🛡️ Live Demo: Livello 1 (Intermedio)</h2>
    <p style="color: #7f8c8d; font-size: 1.1rem; max-width: 800px; margin: 0 auto;">
        Test di iniezione su <strong>Iframe Sourceless Diretto</strong>.<br>
        <span style="color: #27ae60; font-weight: bold;">Verde = Protetto</span> | 
        <span style="color: #c0392b; font-weight: bold;">Rosso + Alert = Vulnerabile</span>
    </p>
</div>

<div id="test-container-l1" style="
    width: 100%;
    max-width: 900px;
    margin: 0 auto; 
    border: 1px solid #e0e0e0; 
    background: #f8f9fa; 
    border-radius: 12px; 
    min-height: 250px; 
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;">
    
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #aaa; font-weight: 500;">
        ⚙️ Inizializzazione test intermedio...
    </div>
</div>

<script>
(function() {
    function avviaTestIntermedio() {
        console.log("--- AVVIO DEMO LIVELLO 1 ---");
        const container = document.getElementById('test-container-l1');
        if(!container) return;
        
        container.innerHTML = ''; 

        try {
            // 1. CREAZIONE IFRAME LIVELLO 1 (Diretto)
            // Questo è il caso intermedio: un iframe sourceless appeso direttamente al body (o container)
            const iframe = document.createElement('iframe');
            iframe.style.width = "100%";
            iframe.style.height = "100%"; 
            iframe.style.minHeight = "250px";
            iframe.style.border = "none";
            container.appendChild(iframe);
            
            setTimeout(() => {
                const doc = iframe.contentWindow.document;
                
                doc.body.style.margin = "0";
                doc.body.style.padding = "20px";
                doc.body.style.fontFamily = "'Segoe UI', Roboto, sans-serif";
                doc.body.style.background = "#ffffff";
                doc.body.style.boxSizing = "border-box";

                // --- DEFINIZIONE CARD VISUALE ---
                const visualStatusHTML = `
                    <div id="status-card-l1" style="
                        background: #d1e7dd; 
                        color: #0f5132; 
                        border: 1px solid #badbcc; 
                        padding: 20px; 
                        border-radius: 8px;
                        display: flex; align-items: center; gap: 20px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                        transition: all 0.3s ease;">
                        <div style="font-size: 40px;">🛡️</div>
                        <div>
                            <strong style="font-size: 1.3rem; display: block; margin-bottom: 5px;">PROTETTO (Livello 1)</strong>
                            <div style="font-size: 1rem; opacity: 0.95; line-height: 1.4;">
                                L'iframe diretto è stato sanitizzato correttamente.
                            </div>
                        </div>
                    </div>
                `;

                // --- SCRIPT MALEVOLO ---
                const attackJS = `
                    alert('XSS RIUSCITO! (Livello 1)'); 
                    var c=document.getElementById('status-card-l1'); 
                    if(c){
                        c.style.background='#f8d7da'; 
                        c.style.borderColor='#f5c6cb'; 
                        c.style.color='#842029'; 
                        c.innerHTML='<div style="font-size:40px;">⚠️</div><div><strong style="font-size:1.3rem;">VULNERABILE (Livello 1)</strong><div style="font-size:1rem;">Iniezione diretta riuscita.</div></div>';
                    }
                `.replace(/\n/g, ' ');

                // --- INIEZIONE ---
                console.log(">>> INIEZIONE PAYLOAD (L1)...");
                
                // Tentativo di iniezione payload nell'iframe appena creato
                const payload = `${visualStatusHTML}<img src=x style="display:none" onerror="${attackJS.replace(/"/g, '&quot;')}" />`;
                
                // Se Trusted Types è attivo senza estensione (Scenario 3), qui avverrà il blocco/crash
                doc.body.innerHTML = payload;

            }, 500); 
        } catch (e) {
            console.error("Errore Demo L1:", e);
            container.innerHTML = `<div style="padding:20px; color:orange;">⛔ BLOCCO BROWSER (Scenario 3 confermato): ${e.message}</div>`;
        }
    }

    window.addEventListener('load', avviaTestIntermedio);
})();
</script>


Test 2:

<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; margin-bottom: 40px;">
    <h2 style="color: #2c3e50; margin-bottom: 10px;">🛡️ Live Demo: Protezione Ricorsiva</h2>
    <p style="color: #7f8c8d; font-size: 1.1rem; max-width: 800px; margin: 0 auto;">
        Test di iniezione su Iframe Sourceless Annidati.<br>
        <span style="color: #27ae60; font-weight: bold;">Verde = Protetto</span> (Estensione Attiva) | 
        <span style="color: #c0392b; font-weight: bold;">Rosso + Alert = Vulnerabile</span> (Estensione Spenta)
    </p>
</div>

<div id="test-container" style="
    width: 100%;
    max-width: 900px;
    margin: 0 auto; 
    border: 1px solid #e0e0e0; 
    background: #f8f9fa; 
    border-radius: 12px; 
    min-height: 450px; 
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;">
    
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #aaa; font-weight: 500;">
        ⚙️ Inizializzazione ambiente di test...
    </div>
</div>

<script>
(function() {
    function avviaTestGrafico() {
        console.log("--- AVVIO DEMO GRAFICA ---");
        const container = document.getElementById('test-container');
        if(!container) return;
        
        container.innerHTML = ''; 

        try {
            // 1. CREAZIONE IFRAME LIVELLO 1 (Padre)
            const iframe1 = document.createElement('iframe');
            iframe1.style.width = "100%";
            iframe1.style.height = "100%"; 
            iframe1.style.minHeight = "450px";
            iframe1.style.border = "none";
            container.appendChild(iframe1);
            
            setTimeout(() => {
                const doc1 = iframe1.contentWindow.document;
                
                doc1.body.style.margin = "0";
                doc1.body.style.padding = "30px";
                doc1.body.style.fontFamily = "'Segoe UI', Roboto, sans-serif";
                doc1.body.style.background = "#ffffff";
                doc1.body.style.boxSizing = "border-box";
                
                doc1.body.innerHTML = `
                    <div style="padding: 25px; border-left: 8px solid #3498db; background: #f4faff; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        <h3 style="margin: 0 0 8px 0; color: #2980b9; font-size: 1.4rem;">Livello 1: Iframe Contenitore</h3>
                        <p style="font-size: 1rem; color: #555; margin-bottom: 0;">
                            Contesto padre (sourceless). Generazione del bersaglio (Livello 2) in corso...
                        </p>
                        <div id="wrapper-l2" style="margin-top: 25px; background: white; padding: 15px; border: 2px dashed #bdc3c7; border-radius: 8px;"></div>
                    </div>
                `;

                // 2. CREAZIONE IFRAME LIVELLO 2 (Bersaglio)
                const iframe2 = doc1.createElement('iframe');
                iframe2.style.width = "100%";
                iframe2.style.height = "180px";
                iframe2.style.border = "none";
                
                doc1.getElementById('wrapper-l2').appendChild(iframe2);

                setTimeout(() => {
                    const doc2 = iframe2.contentWindow.document;
                    doc2.body.style.margin = "0";
                    doc2.body.style.padding = "5px";
                    doc2.body.style.fontFamily = "'Segoe UI', sans-serif";

                    // --- DEFINIZIONE DELLA CARD INIZIALE (SAFE) ---
                    const safeCardHTML = `
                        <div id="status-card" style="
                            background: #d1e7dd; 
                            color: #0f5132; 
                            border: 1px solid #badbcc; 
                            padding: 20px; 
                            border-radius: 8px;
                            display: flex; align-items: center; gap: 20px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                            transition: all 0.3s ease;">
                            <div style="font-size: 40px;">🛡️</div>
                            <div>
                                <strong style="font-size: 1.3rem; display: block; margin-bottom: 5px;">PROTETTO DA TRUSTED TYPES</strong>
                                <div style="font-size: 1rem; opacity: 0.95; line-height: 1.4;">
                                    L'attacco XSS è stato intercettato.<br>Il payload malevolo è stato rimosso.
                                </div>
                            </div>
                        </div>
                    `;

                    // --- DEFINIZIONE DELLO SCRIPT MALEVOLO ---
                    // Attenzione: Questo codice DEVE essere su una riga per funzionare dentro 'onerror'
                    // Qui cambio il colore e il testo se l'attacco riesce.
                    const attackJS = `
                        alert('XSS RIUSCITO!'); 
                        var c=document.getElementById('status-card'); 
                        if(c){
                            c.style.background='#f8d7da'; 
                            c.style.borderColor='#f5c6cb'; 
                            c.style.color='#842029'; 
                            c.innerHTML='<div style="font-size:40px;">⚠️</div><div><strong style="font-size:1.3rem;">VULNERABILE (XSS RIUSCITO)</strong><div style="font-size:1rem;">Il codice iniettato è stato eseguito.</div></div>';
                        }
                    `.replace(/\n/g, ' '); // Rimuovo gli "a capo" per non rompere l'HTML

                    // --- INIEZIONE ---
                    // Se l'estensione è attiva: DOMPurify rimuove tutto l'attributo onerror -> Resta Verde.
                    // Se l'estensione è spenta: L'onerror rimane -> Parte l'alert -> Diventa Rosso.
                    
                    console.log(">>> INIEZIONE PAYLOAD...");
                    
                    // Usiamo replace(/"/g, '&quot;') per non rompere l'attributo onerror=""
                    const payload = `${safeCardHTML}<img src=x style="display:none" onerror="${attackJS.replace(/"/g, '&quot;')}" />`;
                    
                    doc2.body.innerHTML = payload;

                }, 800); 
            }, 500); 
        } catch (e) {
            console.error("Errore Demo:", e);
        }
    }

    window.addEventListener('load', avviaTestGrafico);
})();
</script>