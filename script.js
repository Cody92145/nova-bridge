if ('xr' in navigator) {
    document.getElementById('enterVR').addEventListener('click', async () => {
        try {
            const session = await navigator.xr.requestSession('immersive-vr');
            console.log('XR Session started:', session);
            alert('Nova Bridge VR Mode Activated');
        } catch (err) {
            console.error('Failed to start VR session', err);
        }
    });
} else {
    alert('WebXR not supported in this browser');
}
