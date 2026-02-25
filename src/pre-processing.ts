import { fullAppConfigArr } from "./schemas";

export const getCorruptionConfigFlagIndex = (flagName: string) => {
    switch (flagName) {
        case "usePopupsCorruptionLevelConfig":
            return 0;
        case "useImagesCorruptionLevelConfig":
            return 1
        case "useAudioCorruptionLevelConfig":
            return 2;
        case "useVideosCorruptionLevelConfig":
            return 3;
        case "useSubliminalsCorruptionLevelConfig":
            return 4;
        case "usePromptsCorruptionLevelConfig":
            return 5;
        case "useWebCorruptionLevelConfig":
            return 6;
        case "useHypnoCorruptionLevelConfig":
            return 7;
        case "useWallpaperCorruptionLevelConfig":
            return 8;
        case "useCorruptionCorruptionLevelConfig":
            return 9;
        case "useDenialCorruptionLevelConfig":
            return 10;
        case "useNotificationsCorruptionLevelConfig":
            return 11;
        case "useLowkeyModeCorruptionLevelConfig":
            return 12;
        case "useMitosisModeCorruptionLevelConfig":
            return 13;
        case "useHibernateModeCorruptionLevelConfig":
            return 14;
        case "useBooruCorruptionLevelConfig":
            return 15;
        case "useDangerousCorruptionLevelConfig":
            return 16;
        default:
            return 404; // if flag is useNonCorruptionConfig, then should return 404 as useNonCorruptionConfig is a special case
    }
}
export const applyDefaultPropIfUndefined = (configObj: any, flagIndex: number, flagName: string, propName: string) => {
    if (!configObj.hasOwnProperty(propName)) {
        configObj[propName] = fullAppConfigArr[flagIndex].dependencies[flagName].oneOf[0].properties[propName].default;
    }
}

export const applyDefaultsForCorruptionFlag = (levelConfigObj: any, flagName: string) => {

    // flagIndex starts at 1 now because useNonCorruptionConfig is now the first object in the fullAppConfigArr schema
    let flagIndex = getCorruptionConfigFlagIndex(flagName) + 1;

    // hardcode flag index for non-corruption flag
    if (flagName === "useNonCorruptionConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "rotateWallpaper");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "themeType");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "timerMode");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "timerSetupTime");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "replace");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "replaceThresh");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "showDiscord");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "mitosisMode");
        applyDefaultPropIfUndefined(levelConfigObj, 0, flagName, "hibernateMode");
    }
    else if (flagName === "usePopupsCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "delay");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "singleMode");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "showCaptions");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "buttonless");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "lkScaling");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "movingChance");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "movingSpeed");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "timeoutPopups");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "popupTimeout");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "multiClick");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "clickthroughPopups");
    }
    else if (flagName === "useImagesCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "popupMod");
    }
    else if (flagName === "useAudioCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "audioMod");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "maxAudio");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "audioVolume");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "fadeInDuration");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "fadeOutDuration");
    }
    else if (flagName === "useVideosCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "vidMod");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "maxVideos");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "videoVolume");

    }
    else if (flagName === "useSubliminalsCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "capPopChance");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "capPopOpacity");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "capPopTimer");
    }
    else if (flagName === "usePromptsCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "promptMod");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "promptMistakes");
    }
    else if (flagName === "useWebCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "webPopup");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "webMod");
    }
    else if (flagName === "useHypnoCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "subliminalsChance");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "subliminalsAlpha");

    }
    else if (flagName === "useWallpaperCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "wallpaperTimer");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "wallpaperVariance");
        // applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "wallpaperDat");
    }
    else if (flagName === "useCorruptionCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionTrigger");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionWallpaperCycle");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionThemeCycle");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionTime");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionPopups");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionLaunches");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionFadeType");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "corruptionPurityMode");
    }
    else if (flagName === "useDenialCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "denialChance");
    }
    else if (flagName === "useNotificationsCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "notificationChance");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "notificationImageChance");
    }
    else if (flagName === "useLowkeyModeCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "lkToggle");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "lkCorner");
    }
    else if (flagName === "useMitosisModeCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "mitosisStrength");
    }
    else if (flagName === "useHibernateModeCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "hibernateType");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "hibernateMin");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "hibernateMax");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "wakeupActivity");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "hibernateLength");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "fixWallpaper");
    }
    else if (flagName === "useBooruCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "downloadEnabled");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "tagList");
    }
    else if (flagName === "useDangerousCorruptionLevelConfig") {
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "fill");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "fill_delay");
        applyDefaultPropIfUndefined(levelConfigObj, flagIndex, flagName, "panicDisabled");
    }
}

export const applyAllCorruptionLevelDefaults = (levelConfigObj: any, isMainConfig: boolean) => {
    
    if(isMainConfig) {
        applyDefaultsForCorruptionFlag(levelConfigObj, "useNonCorruptionConfig");
    }

    applyDefaultsForCorruptionFlag(levelConfigObj, "usePopupsCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useImagesCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useAudioCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useVideosCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useSubliminalsCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "usePromptsCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useWebCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useHypnoCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useWallpaperCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useCorruptionCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useDenialCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useNotificationsCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useLowkeyModeCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useMitosisModeCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useHibernateModeCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useBooruCorruptionLevelConfig");
    applyDefaultsForCorruptionFlag(levelConfigObj, "useDangerousCorruptionLevelConfig");
}

export const reintroduceFormFlags = (obj:any) => {
    
    // if there are any values in config.raw
    if(obj?.hasOwnProperty("config") && obj.config.hasOwnProperty("raw") && Object.keys(obj?.config?.raw).length > 0)
    {
        const behaveConfigObj = obj.config.raw;
        reintroduceFlagsInConfigObj(behaveConfigObj, false);
    }

    // this is for corruptions levels
    if(obj?.corruption?.levels?.length > 0)
    {
        for(let i = 0; i < obj.corruption.levels.length; ++i)
        {
            if(! obj.corruption.levels[i].hasOwnProperty("config"))
            {
                obj.corruption.levels[i].config = {};
            }
            const behaveConfigObj = obj.corruption.levels[i].config;
            reintroduceFlagsInConfigObj(behaveConfigObj, true);
        }
    }
}

export const reintroduceFlagsInConfigObj = (behaveConfigObj: any, isCorruptionLevelConfig:boolean) => {
    
    let enableNonCorruptionConfig = !isCorruptionLevelConfig && nonCorruptionSettingsPresent(behaveConfigObj);

    let enablePopupsLevelConfig = popupLevelSettingsPresent(behaveConfigObj);
    let enableImagesLevelConfig = imageLevelSettingsPresent(behaveConfigObj);
    let enableAudioLevelConfig = audioLevelSettingsPresent(behaveConfigObj);
    let enableVideosLevelConfig = videosLevelSettingsPresent(behaveConfigObj);
    let enableSubliminalsLevelConfig = subliminalsLevelSettingsPresent(behaveConfigObj);
    let enablePromptsLevelConfig = promptsLevelSettingsPresent(behaveConfigObj);
    let enableWebLevelConfig = webLevelSettingsPresent(behaveConfigObj);
    let enableHypnoLevelConfig = hypnoLevelSettingsPresent(behaveConfigObj);
    let enableWallpaperLevelConfig = wallpaperLevelSettingsPresent(behaveConfigObj);
    let enableCorruptionLevelConfig = corruptionLevelSettingsPresent(behaveConfigObj);
    let enableDenialLevelConfig = denialLevelSettingsPresent(behaveConfigObj);
    let enableNotificationsLevelConfig = notificationsLevelSettingsPresent(behaveConfigObj);
    let enableLowkeyModeLevelConfig = lowkeyModeLevelSettingsPresent(behaveConfigObj);
    let enableMitosisLevelConfig = mitosisModeLevelSettingsPresent(behaveConfigObj);
    let enableHibernateModeLevelConfig = hibernateModeLevelSettingsPresent(behaveConfigObj);
    let enableBooruLevelConfig = booruLevelSettingsPresent(behaveConfigObj);
    let enableDangerousLevelConfig = dangerousLevelSettingsPresent(behaveConfigObj);

    // had this line below because I thought I needed to set default values for all values in a section to get rid of validation errors - not true
    // applyAllCorruptionLevelDefaults(behaveConfigObj);

    if(isCorruptionLevelConfig)
    {
        let enableLevelConfig = enablePopupsLevelConfig ||
        enableAudioLevelConfig ||
        enableVideosLevelConfig ||
        enableSubliminalsLevelConfig ||
        enablePromptsLevelConfig || 
        enableWebLevelConfig || 
        enableHypnoLevelConfig || 
        enableWallpaperLevelConfig || 
        enableCorruptionLevelConfig || 
        enableDenialLevelConfig ||
        enableNotificationsLevelConfig ||
        enableLowkeyModeLevelConfig ||
        enableMitosisLevelConfig ||
        enableHibernateModeLevelConfig ||
        enableBooruLevelConfig ||
        enableDangerousLevelConfig;
    
        if (enableLevelConfig) {
            behaveConfigObj["useCorruptionLevelConfig"] = true;
        }
    }
    
    if(enableNonCorruptionConfig) {
        behaveConfigObj["useNonCorruptionConfig"] = true;
    }

    if (enablePopupsLevelConfig) {
        behaveConfigObj["usePopupsCorruptionLevelConfig"] = true;
    }

    if (enableImagesLevelConfig) {
        behaveConfigObj["useImagesCorruptionLevelConfig"] = true;
    }

    if (enableAudioLevelConfig) {
        behaveConfigObj["useAudioCorruptionLevelConfig"] = true;
    }

    if (enableVideosLevelConfig) {
        behaveConfigObj["useVideosCorruptionLevelConfig"] = true;
    }

    if (enableSubliminalsLevelConfig) {
        behaveConfigObj["useSubliminalsCorruptionLevelConfig"] = true;
    }

    if (enablePromptsLevelConfig) {
        behaveConfigObj["usePromptsCorruptionLevelConfig"] = true;
    }

    if (enableWebLevelConfig) {
        behaveConfigObj["useWebCorruptionLevelConfig"] = true;
    }

    if (enableHypnoLevelConfig) {
        behaveConfigObj["useHypnoCorruptionLevelConfig"] = true;
    }

    if (enableWallpaperLevelConfig) {
        behaveConfigObj["useWallpaperCorruptionLevelConfig"] = true;
    }

    if (enableCorruptionLevelConfig) {
        behaveConfigObj["useCorruptionCorruptionLevelConfig"] = true;
    }

    if (enableDenialLevelConfig) {
        behaveConfigObj["useDenialCorruptionLevelConfig"] = true;
    }

    if (enableNotificationsLevelConfig) {
        behaveConfigObj["useNotificationsCorruptionLevelConfig"] = true;
    }

    if (enableLowkeyModeLevelConfig) {
        behaveConfigObj["useLowkeyModeCorruptionLevelConfig"] = true;
    }

    if (enableMitosisLevelConfig) {
        behaveConfigObj["useMitosisModeCorruptionLevelConfig"] = true;
    }

    if (enableHibernateModeLevelConfig) {
        behaveConfigObj["useHibernateModeCorruptionLevelConfig"] = true;
    }

    if (enableBooruLevelConfig) {
        behaveConfigObj["useBooruCorruptionLevelConfig"] = true;
    }

    if (enableDangerousLevelConfig) {
        behaveConfigObj["useDangerousCorruptionLevelConfig"] = true;
    }
}

const nonCorruptionSettingsPresent = (behaveConfigObj:any):boolean => {
    return behaveConfigObj.hasOwnProperty("rotateWallpaper") || 
        behaveConfigObj.hasOwnProperty("themeType") ||
        behaveConfigObj.hasOwnProperty("timerMode") ||
        behaveConfigObj.hasOwnProperty("timerSetupTime") ||
        behaveConfigObj.hasOwnProperty("replace") ||
        behaveConfigObj.hasOwnProperty("replaceThresh") ||
        behaveConfigObj.hasOwnProperty("showDiscord") ||
        behaveConfigObj.hasOwnProperty("mitosisMode") ||
        behaveConfigObj.hasOwnProperty("hibernateMode")
    ;
}

const popupLevelSettingsPresent = (behaveConfigObj:any):boolean => {
    return behaveConfigObj.hasOwnProperty("delay") || 
        behaveConfigObj.hasOwnProperty("singleMode") ||
        behaveConfigObj.hasOwnProperty("showCaptions") ||
        behaveConfigObj.hasOwnProperty("buttonless") ||
        behaveConfigObj.hasOwnProperty("lkScaling") || 
        behaveConfigObj.hasOwnProperty("movingChance") || 
        behaveConfigObj.hasOwnProperty("movingSpeed") || 
        behaveConfigObj.hasOwnProperty("timeoutPopups") || 
        behaveConfigObj.hasOwnProperty("popupTimeout") || 
        behaveConfigObj.hasOwnProperty("multiClick") ||
        behaveConfigObj.hasOwnProperty("clickthroughPopups") 
    ;
}

const imageLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("popupMod")
    ;
}

const audioLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("audioMod") ||
        behaveConfigObj.hasOwnProperty("maxAudio") ||
        behaveConfigObj.hasOwnProperty("audioVolume") ||
        behaveConfigObj.hasOwnProperty("fadeInDuration") ||
        behaveConfigObj.hasOwnProperty("fadeOutDuration")
    ;
}

const videosLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("vidMod") ||
        behaveConfigObj.hasOwnProperty("maxVideos") ||
        behaveConfigObj.hasOwnProperty("videoVolume")
    ;
}

const subliminalsLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("capPopChance") ||
        behaveConfigObj.hasOwnProperty("capPopOpacity") ||
        behaveConfigObj.hasOwnProperty("capPopTimer")
    ;
}

const promptsLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("promptMod") ||
        behaveConfigObj.hasOwnProperty("promptMistakes")
    ;
}

const webLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("webPopup") ||
        behaveConfigObj.hasOwnProperty("webMod")
    ;
}

const hypnoLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("subliminalsChance") ||
        behaveConfigObj.hasOwnProperty("subliminalsAlpha")
    ;
}

const wallpaperLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("wallpaperTimer") ||
        behaveConfigObj.hasOwnProperty("wallpaperVariance") ||
        behaveConfigObj.hasOwnProperty("wallpaperDat")
    ;
}

const corruptionLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("corruptionTrigger") ||
        behaveConfigObj.hasOwnProperty("corruptionWallpaperCycle") ||
        behaveConfigObj.hasOwnProperty("corruptionThemeCycle") ||
        behaveConfigObj.hasOwnProperty("corruptionTime") ||
        behaveConfigObj.hasOwnProperty("corruptionPopups") ||
        behaveConfigObj.hasOwnProperty("corruptionLaunches") ||
        behaveConfigObj.hasOwnProperty("corruptionFadeType") ||
        behaveConfigObj.hasOwnProperty("corruptionPurityMode")
    ;
}

const denialLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("denialChance")
    ;
}

const notificationsLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("notificationChance") ||
        behaveConfigObj.hasOwnProperty("notificationImageChance")
    ;
}

const lowkeyModeLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("lkToggle") ||
        behaveConfigObj.hasOwnProperty("lkCorner")
    ;
}

const mitosisModeLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("mitosisStrength")
    ;
}

const hibernateModeLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("hibernateType") ||
        behaveConfigObj.hasOwnProperty("hibernateMin") ||
        behaveConfigObj.hasOwnProperty("hibernateMax") ||
        behaveConfigObj.hasOwnProperty("wakeupActivity") ||
        behaveConfigObj.hasOwnProperty("hibernateLength") ||
        behaveConfigObj.hasOwnProperty("fixWallpaper")
    ;
}

const booruLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("downloadEnabled") ||
        behaveConfigObj.hasOwnProperty("tagList")
    ;
}

const dangerousLevelSettingsPresent = (behaveConfigObj: any): boolean => {
    return behaveConfigObj.hasOwnProperty("fill") ||
        behaveConfigObj.hasOwnProperty("fill_delay") ||
        behaveConfigObj.hasOwnProperty("panicDisabled") 
    ;
}