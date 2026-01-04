/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */
import { EventEmitter } from 'events';
import { ChildProcessWithoutNullStreams } from 'child_process';
export type LoaderType = 'forge' | 'neoforge' | 'fabric' | 'legacyfabric' | 'quilt';
export type JavaType = 'jre' | 'jdk' | 'testimage' | 'debugimage' | 'staticlibs' | 'sources' | 'sbom';
export type loaderOptions = {
    /**
     * Path to loader directory. Relative to absolute path to Minecraft's root directory (config option `path`).
     *
     * If `undefined`, defaults to `.minecraft/loader/<loader_type>`.
     *
     * Example: `'fabricfiles'`.
     */
    path?: string;
    /**
     * Loader type.
     */
    type?: LoaderType;
    /**
     * Loader build (version).
     *
     * Acceptable values: `'latest'`, `'recommended'`, actual version.
     *
     * Example: `'0.16.3'`
     */
    build?: string;
    /**
     * Should the launcher use a loader?
     */
    enable?: boolean;
};
/**
 * Screen options.
 */
export type screenOptions = {
    width?: number;
    height?: number;
    /**
     * Should Minecraft be started in fullscreen mode?
     */
    fullscreen?: boolean;
};
/**
 * Memory limits
 */
export type memoryLimits = {
    /**
     * Sets the `-Xms` JVM argument. This is the initial memory usage.
     */
    min?: string;
    /**
     * Sets the `-Xmx` JVM argument. This is the limit of memory usage.
     */
    max?: string;
};
/**
 * Java download options
 */
export type javaOptions = {
    /**
     * Absolute path to Java binaries directory.
     *
     * If set, expects Java to be already downloaded. If `undefined`, downloads Java and sets it automatically.
     *
     * Example: `'C:\Program Files\Eclipse Adoptium\jdk-21.0.2.13-hotspot\bin'`
     */
    path?: string;
    /**
     * Java version number.
     *
     * If set, fetched from https://api.adoptium.net.
     * If `undefined`, fetched from [Mojang](https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json).
     *
     * Example: `21`
     */
    version?: string;
    /**
     * Java image type. Acceptable values: `'jdk'`, `'jre'`, `'testimage'`, `'debugimage'`, `'staticlibs'`, `'sources'`, `'sbom'`.
     *
     * Using `jre` is recommended since it only has what's needed.
     */
    type: JavaType;
};
/**
 * Launch options.
 */
export type LaunchOptions = {
    /**
     * URL to the launcher backend. Refer to [Selvania Launcher Wiki](https://github.com/luuxis/Selvania-Launcher/blob/master/docs/wiki_EN-US.md) for setup instructions.
     */
    url?: string | null;
    /**
     * Something to Authenticate the player.
     *
     * Refer to `Mojang`, `Microsoft` or `AZauth` classes.
     *
     * Example: `await Mojang.login('Luuxis')`
     */
    authenticator: any;
    /**
     * Connection timeout in milliseconds.
     */
    timeout?: number;
    /**
     * Absolute path to Minecraft's root directory.
     *
     * Example: `'%appdata%/.minecraft'`
     */
    path: string;
    /**
     * Minecraft version.
     *
     * Example: `'1.20.4'`
     */
    version: string;
    /**
     * Path to instance directory. Relative to absolute path to Minecraft's root directory (config option `path`).
     * This separates game files (e.g. versions, libraries, assets) from game data (e.g. worlds, resourcepacks, options).
     *
     * Example: `'PokeMoonX'`
     */
    instance?: string | null;
    /**
     * Should Minecraft process be independent of launcher?
     */
    detached?: boolean;
    /**
     * How many concurrent downloads can be in progress at once.
     */
    downloadFileMultiple?: number;
    /**
     * Should the launcher bypass offline mode?
     *
     * If `true`, the launcher will not check if the user is online.
     */
    bypassOffline?: boolean;
    intelEnabledMac?: boolean;
    /**
     * Loader config
     */
    loader: loaderOptions;
    /**
     * MCPathcer directory. (idk actually luuxis please verify this)
     *
     * If `instance` if set, relative to it.
     * If `instance` is `undefined`, relative to `path`.
     */
    mcp?: any;
    /**
     * Should game files be verified each launch?
     */
    verify?: boolean;
    /**
     * Files to ignore from instance. (idk actually luuxis please verify this)
     */
    ignored?: string[];
    /**
     * Custom JVM arguments. Read more on [wiki.vg](https://wiki.vg/Launching_the_game#JVM_Arguments)
     */
    JVM_ARGS?: string[];
    /**
     * Custom game arguments. Read more on [wiki.vg](https://wiki.vg/Launching_the_game#Game_Arguments)
     */
    GAME_ARGS?: string[];
    /**
     * Java options.
     */
    java: javaOptions;
    /**
     * Screen options.
     */
    screen?: screenOptions;
    /**
     * Memory limit options.
     */
    memory?: memoryLimits;
    /**
     * Optional async hook executed before the game is spawned.
     * Throwing or rejecting aborts the launch. Receives an AbortSignal to support cancellation.
     */
    preLaunch?: (signal: AbortSignal) => Promise<void> | void;
};
type DownloadElement = any;
export interface LauncherEvents {
    starting: [resolvedOptions: LaunchOptions];
    spawn: [process: ChildProcessWithoutNullStreams, javaPath: string, args: string[], cwd: string];
    close: [message: string | number | undefined];
    data: [message: string];
    error: [error: any];
    progress: [downloaded: number, total: number, element: DownloadElement];
    speed: [bytesPerSecond: number];
    estimated: [seconds: number];
    extract: [progress: any];
    check: [progress: any, size: any, element: any];
    patch: [patchInfo: any];
}
export default class Launcher extends EventEmitter {
    options: LaunchOptions;
    private _abortController?;
    on<E extends keyof LauncherEvents>(event: E, listener: (...args: LauncherEvents[E]) => void): this;
    once<E extends keyof LauncherEvents>(event: E, listener: (...args: LauncherEvents[E]) => void): this;
    off<E extends keyof LauncherEvents>(event: E, listener: (...args: LauncherEvents[E]) => void): this;
    emit<E extends keyof LauncherEvents>(event: E, ...args: LauncherEvents[E]): boolean;
    /**
     * Allows canceling a launch in progress before the game is spawned.
     */
    cancelLaunch(): void;
    launch(options: Partial<LaunchOptions>): Promise<boolean>;
    getLaunchOptions(optionsOverride?: Partial<LaunchOptions>): LaunchOptions;
    start(): Promise<boolean>;
    downloadGame(): Promise<any>;
}
export {};
