(function () {
    // Enables strict mode to catch common errors and improve security.
    'use strict';

    function enableRecursiveTTProtection() {
        
        // --- CONFIGURATIONS ---
        const CONFIG = {
            FALLBACK_POLICY_NAME: 'recursive-tt-protection'
        };

        function findDOMPurify() {
            // Looks for DOMPurify in the current or parent window
            if (window.DOMPurify) return window.DOMPurify;
            try {
                if (window.top && window.top.DOMPurify) return window.top.DOMPurify;
            } catch (e) {}
            return null;
        }

        function obtainTrustedTypesPolicy() {
            if (!('trustedTypes' in window)) return null;

            const purifier = findDOMPurify();
            
            const createHTML = (input) => {
                // Sanitizes HTML input using DOMPurify to block XSS
                if (purifier && typeof purifier.sanitize === 'function') {
                    return purifier.sanitize(input, { RETURN_TRUSTED_TYPE: false });
                }
                console.error('DOMPurify not found! Cannot sanitize');
                throw new Error('Unsafe HTML blocked by TT Policy');
            };

            const createScript = (input) => {
                // Allows only the recursive protection script to run
                if (input.includes('enableRecursiveTTProtection')) return input;
                throw new Error('Script execution blocked by Policy');
            };

            const createScriptURL = (input) => {
                // Validates that script URLs are same-origin
                 try {
                    const url = new URL(input, location.href);
                    if (url.origin === location.origin) return input;
                 } catch(e){}
                 throw new Error('Script URL blocked');
            };

            try {
                // Tries to use or create the default policy.
                if (trustedTypes.defaultPolicy) return trustedTypes.defaultPolicy;
                return trustedTypes.createPolicy('default', { createHTML, createScript, createScriptURL });
            } catch (e) {
                try {
                    // Fallback: if 'default' is taken or forbidden, we create a named policy.
                    // However, this approach requires rewriting the site's code to
                    // explicitly invoke the policy, making it an ineffective strategy for
                    // zero-config protection on third-party applications.
                    return trustedTypes.createPolicy(CONFIG.FALLBACK_POLICY_NAME, { createHTML, createScript, createScriptURL });
                } catch (ee) { return null; }
            }
        }

        function injectProtectionIntoIframe(iframeNode, policy) {
            if (!iframeNode || !iframeNode.contentWindow) return;
            
            // Prepares the self-replicating script
            const scriptContent = `(${enableRecursiveTTProtection.toString()})();`;
            
            try {
                const iframeDoc = iframeNode.contentWindow.document;
                const scriptEl = iframeDoc.createElement('script');
                const trustedScript = policy.createScript(scriptContent);
                // Using .text is allowed here thanks to Trusted Types with 'unsafe-inline'.
                scriptEl.text = trustedScript;

                // Injecting the script into the iframe's DOM (head or body)
                const target = iframeDoc.head || iframeDoc.body || iframeDoc.documentElement;
                target.appendChild(scriptEl);

                console.log('Injection completed (via DOM) in:', iframeNode.id || 'anonymous iframe');
            } catch (e) {
                console.warn('Injection failed:', e);
            }
        }

        // --- START ---
        if (window.ttProtectionEnabled) return;
        
        // Creates the Trusted Types policy
        const policy = obtainTrustedTypesPolicy();
        if (!policy) {
            console.error('Unable to create Policy. Protection aborted.');
            return;
        }

        // Monitors the DOM for new iframes using MutationObserver
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.tagName === 'IFRAME') {
                        injectProtectionIntoIframe(node, policy);
                    }
                });
            });
        });
        
        observer.observe(document.documentElement, { childList: true, subtree: true });
        
        window.ttProtectionEnabled = true;
        console.log('Protection enabled on:', window.location.href || 'about:blank');
    }

    try {
        if ('trustedTypes' in window) {
            enableRecursiveTTProtection();
        }
    } catch (e) {
        console.error('Security startup error:', e);
    }

})();