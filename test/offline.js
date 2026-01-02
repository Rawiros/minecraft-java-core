const { Launcher, Offline } = require('minecraft-java-core');
const launcher = new Launcher();

(async () => {
    await launcher.launch({
        path: './minecraft',
        authenticator: Offline.login('Luuxis'),
        version: '1.16.5',
        intelEnabledMac: true,
        bypassOffline: true,
        loader: {
            path: './',
            type: 'fabric',
            build: 'latest',
            enable: true
        },
        memory: {
            min: '2G',
            max: '2G'
        },
    });

    launcher
        // lifecycle
        .on('starting', (opts) => console.log('[Launcher] starting with version:', opts.version))
        .on('spawn', (proc, javaPath, args, cwd) => {
            console.log('[Launcher] spawned', { javaPath, cwd });
            console.log('[Launcher] pid:', proc.pid);
        })
        .on('close', (message) => console.log('[Launcher] close:', message ?? 'Game exited.'))

        // io and logging
        .on('data', line => process.stdout.write(line))

        // errors
        .on('error', (err) => console.error('[Launcher] error:', err))

        // downloads and install progress
        .on('progress', (downloaded, total, element) => {
            const pct = total ? ((downloaded / total) * 100).toFixed(2) : '0.00';
            console.log(`[DL] ${pct}% ${element?.path || element?.name || ''}`);
        })
        .on('speed', (bps) => console.log(`[DL] speed: ${(bps / 1024).toFixed(2)} kB/s`))
        .on('estimated', (sec) => console.log(`[DL] eta: ${Math.max(0, Math.floor(sec))}s`))
        .on('extract', (progress) => console.log('[Extract]', progress))
        .on('check', (progress, size, element) => console.log('[Check]', { progress, size, name: element?.path || element?.name || 'unknown' }))
        .on('patch', patch => process.stdout.write(patch))
})();
