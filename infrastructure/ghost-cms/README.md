The testing environment consists of a local Ghost CMS instance.
XSS attack tests were performed by creating Posts containing XSS payloads embedded within iframes (possibly nested) in a HTML section, in order to verify the effectiveness of the Trusted Types propagation handled by the extension.

--- Scenario 1 ---

<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; margin-bottom: 40px;">
    <h3 style="color: #2c3e50; margin-bottom: 10px;">Scenario 1</h3>
</div>
<div id="zona-test"></div>

<script>
  try {
     document.getElementById('zona-test').innerHTML =
       '<img src="x" onerror="alert(\'XSS RIUSCITO!\')">';
  } catch(e) {
     console.log("Bloccato da Trusted Types!");
  }
</script>


--- Scenario 2 ---

<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; margin-bottom: 40px;">
    <h3 style="color: #2c3e50; margin-bottom: 10px;">Scenario 2</h3>
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
        ⚙️ Inizializzazione in corso...
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
                            <strong style="font-size: 1.3rem; display: block; margin-bottom: 5px;">PROTETTO DA TRUSTED TYPES</strong>
                            <div style="font-size: 1rem; opacity: 0.95; line-height: 1.4;">
                                L'attacco XSS è stato intercettato.<br>Il payload malevolo è stato rimosso.
                            </div>
                        </div>
                    </div>
                `;

                const attackJS = `
                    var c=document.getElementById('status-card-l1'); 
                    if(c){
                        c.style.background='#f8d7da'; 
                        c.style.borderColor='#f5c6cb'; 
                        c.style.color='#842029'; 
                        c.innerHTML='<div style="font-size:40px;">⚠️</div><div><strong style="font-size:1.3rem;">VULNERABILE (Livello 1)</strong><div style="font-size:1rem;">Iniezione diretta riuscita.</div></div>';
                    }
                    setTimeout(function(){ alert('XSS RIUSCITO!'); }, 50);
                `.replace(/\n/g, ' ');

                console.log(">>> INIEZIONE PAYLOAD (L1)...");
            
                const payload = `${visualStatusHTML}<img src=x style="display:none" onerror="${attackJS.replace(/"/g, '&quot;')}" />`;
                
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


--- Scenario 3 ---

<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; margin-bottom: 40px;">
    <h3 style="color: #2c3e50; margin-bottom: 10px;">Scenario 3</h3>
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
        ⚙️ Inizializzazione in corso...
    </div>
</div>

<script>
(function() {
    function avviaTestGrafico() {
        console.log("--- AVVIO DEMO GRAFICA SCENARIO 3 ---");
        const container = document.getElementById('test-container');
        if(!container) return;
        
        container.innerHTML = ''; 

        try {
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
                            Contesto padre (sourceless).
                        </p>
                        <div id="wrapper-l2" style="margin-top: 25px; background: white; padding: 15px; border: 2px dashed #bdc3c7; border-radius: 8px;"></div>
                    </div>
                `;

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

                    const attackJS = `
                        var c=document.getElementById('status-card'); 
                        if(c){
                            c.style.background='#f8d7da'; 
                            c.style.borderColor='#f5c6cb'; 
                            c.style.color='#842029'; 
                            c.innerHTML='<div style="font-size:40px;">⚠️</div><div><strong style="font-size:1.3rem;">VULNERABILE (XSS RIUSCITO)</strong><div style="font-size:1rem;">Il codice iniettato è stato eseguito.</div></div>';
                        }
                        setTimeout(function(){ alert('XSS RIUSCITO!'); }, 100);
                    `.replace(/\n/g, ' '); 
                  
                    console.log(">>> INIEZIONE PAYLOAD...");
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
