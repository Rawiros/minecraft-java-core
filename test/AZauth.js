const prompt = require('prompt')
const { AZauth, Launcher } = require('../build/Index');
const launcher = new Launcher();
const auth = new AZauth('https://nincraft.fr');
const fs = require('fs');

let mc
async function login() {
    console.log('set your email or username');
    prompt.start();
    let { email } = await prompt.get(['email']);
    console.log('set your password');
    let { password } = await prompt.get(['password']);
    let azauth = await auth.login(email, password);

    if (azauth.A2F) {
        console.log('set your 2FA code');
        let { code } = await prompt.get(['code']);
        azauth = await auth.login(email, password, code);
    }

    if (azauth.error) {
        console.log(azauth);
        process.exit(1);
    }
    return azauth;
}

async function main() {
    if (!fs.existsSync('./AZauth.json')) {
        mc = await login();
        fs.writeFileSync('./AZauth.json', JSON.stringify(mc, null, 4));
    } else {
        mc = JSON.parse(fs.readFileSync('./AZauth.json'));

        if (!mc.access_token) {
            mc = await login();
            fs.writeFileSync('./AZauth.json', JSON.stringify(mc, null, 4));
        } else {
            mc = await auth.verify(mc);
            if (mc.error) mc = await login();
            fs.writeFileSync('./AZauth.json', JSON.stringify(mc, null, 4));
        }
    }

    let opt = {
        // url: 'https://luuxis.fr/api/user/893bbc-a0bc41-da8568-ef56dd-7f2df8/files',
        authenticator: mc,
        timeout: 10000,
        path: './Minecraft',
        version: '1.16.5',
        detached: false,
        intelEnabledMac: true,
        downloadFileMultiple: 10,

        loader: {
            type: 'forge',
            build: 'latest',
            enable: true
        },

        verify: false,
        ignored: ['loader', 'options.txt'],
        args: [],

        javaPath: null,
        java: true,

        screen: {
            width: null,
            height: null,
            fullscreen: null,
        },

        memory: {
            min: '2G',
            max: '4G'
        }
    }

    await launcher.launch(opt);

    launcher.on('extract', extract => {
        console.log(extract);
    });

    launcher.on('progress', (progress, size, element) => {
        console.log(`Downloading ${element} ${Math.round((progress / size) * 100)}%`);
    });

    launcher.on('check', (progress, size, element) => {
        console.log(`Checking ${element} ${Math.round((progress / size) * 100)}%`);
    });

    launcher.on('estimated', (time) => {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time - hours * 3600) / 60);
        let seconds = Math.floor(time - hours * 3600 - minutes * 60);
        console.log(`${hours}h ${minutes}m ${seconds}s`);
    })

    launcher.on('speed', (speed) => {
        console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
    })

    launcher.on('patch', patch => {
        console.log(patch);
    });

    launcher.on('data', (e) => {
        console.log(e);
    })

    launcher.on('close', code => {
        console.log(code);
    });

    launcher.on('error', err => {
        console.log(err);
    });
}

main()