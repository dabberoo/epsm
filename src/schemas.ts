import type { RJSFSchema } from "@rjsf/utils"

const webLinkSchema: RJSFSchema = {
    type: "object",
    title: "Link",
    required: ["url"],
    properties: {
        url: { type: "string", title: "Base URL", description: "A website address. E.g \"https://duckduckgo.com/\""},
        args: {
            type: "array",
            title: "Args",
            items: {
                type: "string", title: "Argument", description: "Text added to the base URL. For example if based URL is \"https://duckduckgo.com/\" and argument text is \"?q=edgeware\", then full URL is \"https://duckduckgo.com/?q=edgeware\""
            }
        }
    }
}

const moodPropsSchema: RJSFSchema = {
    type: "object",
    required: ["mood"],
    properties: {
        mood: { type: "string", title: "Mood" },
        "popup-close": { type: "string", title: "Popup Close Label", default: "Close Popup", description: "Label for a Popup's 'close' button"},
        "max-clicks": { type: "number", title: "Max Clicks", default: 1, description: "Maximum number of clicks to close a Popup"},
        captions: {
            type: "array",
            title: "Captions",
            items: {
                type: "string", title: "Caption", default: "Caption Text" 
            },
            description: "Text added to the corner of a Popup"
        },
        denial: {
            type: "array",
            title: "Denial Captions",
            items: {
                type: "string",
                title: "Denial Caption",
                default: "Denial Text",
            },
            description: "Text added when a Popup is censored"
        },
        "subliminal-messages": {
            type: "array",
            title: "Subliminal Messages",
            items: {
                type: "string", title: "Subliminal Message", default: "Subliminal Message Text"
            },
            description: "Text that flashes on the screen for Subliminal Popups"
        },
        notifications: {
            type: "array",
            title: "Notifications",
            items: {
                type: "string", title: "Notification", default: "Notification Text"
            },
            description: "Text for desktop Notifications Popups"
        },
        prompts: {
            type: "array",
            title: "Prompts",
            items: {
                type: "string", title: "Prompt", default: "Prompt Text"
            },
            description: "Text that the user must type for a Prompt Popup"

        },
        web: {
            type: "array",
            title: "Web",
            items: {
                ...webLinkSchema
            },
            description: "Website links that open for Web Popups"
        },
    }
}


export const appConfigArr = [
    {
        properties: {
            usePopupsCorruptionLevelConfig: { type: "boolean", title: "General Popups Settings?", default: false },
        },
        dependencies: {
            usePopupsCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            usePopupsCorruptionLevelConfig: { const: true },

                            delay: { type: "number", minimum: 10, maximum: 60000, default: 5000, description: "Time in milliseconds before Edgeware++ tries to show another Popup"}, // (120) The time interval (in milliseconds) before the program attempts to display another pop-up.
                            singleMode: {type: "number", minimum: 0, maximum: 1, default: 1, enum: [0, 1], description: "Enable (1) or Disable (0) Single Mode, where only one type of Popup ( Image / Video / Audio / Prompt / Notification ) spawns at a time"},
                            showCaptions: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) showing Captions on Image/Video Popups"}, // (1) A boolean (1 for true, 0 for false) that enables or disables the Subliminal Overlay feature. (Captions will appear as a brief subliminal message on the screen). INCORRECT NOW, this is for captions on image/video popups
                            buttonless: {type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) buttonless Image/Video Popups. These Popups can be closed by clicking on them"},
                            lkScaling: { type: "number", minimum: 0, maximum: 100, default: 100, description: "Opacity of Image/Video Popups. 100 is fully opaque, 0 is fully transparent"},
                            movingChance: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability that a Popup will move around"}, // (5) The likelihood (in percentage) that an active pop-up will begin to move.
                            movingSpeed: { type: "number", minimum: 1, maximum: 15, default: 5, description: "Speed of a moving Popup"}, // (2) Determines the speed at which the pop-up moves across the screen.
                            timeoutPopups: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) self-closing Popups"}, // (1) A boolean (1 for true, 0 for false) that enables or disables the automatic closing of pop-ups.
                            popupTimeout: { type: "number", minimum: 1, maximum: 120, default: 1, description: "Time in seconds before a Popup closes itself (self-closing Popups must be enabled)"},// (36) The duration (in seconds) a pop-up will remain on screen before automatically closing.
                            multiClick: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) ability for Popups to require multiple clicks to close"},   // (0) A boolean (1 for true, 0 for false) that enables or disables the ability to for a pop up to require more than 1 clicks. (The pack needs to support this feature to be useable!)
                            clickthroughPopups: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) unclickable Image/Video Popups. Clicks will interact with whatever is below the Popup(s)" }
                        }
                    },
                    {
                        properties: {
                            usePopupsCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useImagesCorruptionLevelConfig: { type: "boolean", title: "Image Popup Settings?", default: false },
        },
        dependencies: {
            useImagesCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useImagesCorruptionLevelConfig: { const: true },

                            popupMod: { type: "number", minimum: 0, maximum: 100, default: 100, description: "Probability of an Image Popup appearing after each delay"},  // (90) Sets the probability (in percentage) of a pop-up appearing with each attempt. (CORRECTION, APPLIES TO IMAGE POPUPS ONLY)
                        }
                    },
                    {
                        properties: {
                            useImagesCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useAudioCorruptionLevelConfig: { type: "boolean", title: "Audio Popup Settings?", default: false },
        },
        dependencies: {
            useAudioCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useAudioCorruptionLevelConfig: { const: true },

                            audioMod: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability of a Audio Popup playing after each delay"},// (100) Sets the probability (in percentage) of an Background Audio appearing with each attempt.
                            maxAudio: { type: "number", minimum: 1, maximum: 50, default: 1, description: "Maximum number of Audio Popups that can be playing at the same time"},   // (1) Sets the maximum amount of Background Audio able to be played in the background.
                            audioVolume: { type: "number", minimum: 0, maximum: 100, default: 25, description: "Volume percentage of Audio Popups"},  // (25) Sets the volume (in percentage) of the audio.
                            fadeInDuration: {type: "number", minimum: 0, maximum: 10000, default: 0, description: "Volume fade-in duration of Audio Popups in milliseconds"},
                            fadeOutDuration: {type: "number", minimum: 0, maximum: 10000, default: 0, description: "Volume fade-out duration of Audio Popups in milliseconds"}
                        }
                    },
                    {
                        properties: {
                            useAudioCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useVideosCorruptionLevelConfig: { type: "boolean", title: "Videos Popup Settings?", default: false },
        },
        dependencies: {
            useVideosCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useVideosCorruptionLevelConfig: { const: true },

                            vidMod: { type: "number", minimum: 0, maximum: 100, default: 10, description: "Probability of a Video Popup playing after each delay"}, // (5) Sets the probability (in percentage) of an Video appearing with each attempt.
                            maxVideos: { type: "number", minimum: 1, maximum: 50, default: 10, description: "Maximum number of Video Popups that can be playing at the same time"},// (5) Sets the max amount of video able to appear.
                            videoVolume: { type: "number", minimum: 0, maximum: 100, default: 25, description: "Volume percentage of Video Popups"},  // (25) Sets the volume (in percentage) of the videos.
                        }
                    },
                    {
                        properties: {
                            useVideosCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useSubliminalsCorruptionLevelConfig: { type: "boolean", title: "Subliminal Popup Settings?", default: false },
        },
        dependencies: {
            useSubliminalsCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useSubliminalsCorruptionLevelConfig: { const: true },

                            capPopChance: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability of a Subliminal Popup showing after each delay"}, // (40) Sets the probability (in percentage) of an Subliminal Caption appearing with each attempt.
                            capPopOpacity: { type: "number", minimum: 0, maximum: 100, default: 100, description: "Opacity of Subliminal Popups. 100 is fully opaque, 0 is fully transparent"}, // (100) Sets the Opacity (in percentage) of Subliminal Captions.
                            capPopTimer: { type: "number", minimum: 1, maximum: 1000, default: 300, description: "Time in milliseconds that a Subliminal Popup is visible"}, // (300) Sets how long (in milliseconds) a Subliminal Captions will flash on the screen.
                        }
                    },
                    {
                        properties: {
                            useSubliminalsCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            usePromptsCorruptionLevelConfig: { type: "boolean", title: "Prompt Popups Settings?", default: false },
        },
        dependencies: {
            usePromptsCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            usePromptsCorruptionLevelConfig: { const: true },

                            promptMod: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability of a Prompt Popup showing after each delay"},// (0) This was marked as boolean, but I think it should be percentage (YES, ITS A PERCENTAGE IN V20 CODE)
                            promptMistakes: { type: "number", minimum: 0, maximum: 150, default: 3, description: "Number of spelling mistakes allowed when user submits a prompt"}, // (3) Sets how much typing errors are acceptable when accepting a prompt writing.
                        }
                    },
                    {
                        properties: {
                            usePromptsCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useWebCorruptionLevelConfig: { type: "boolean", title: "Web Popups Settings?", default: false },
        },
        dependencies: {
            useWebCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useWebCorruptionLevelConfig: { const: true },

                            webPopup: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) opening a Web Popup when an Image/Video Popup closes"}, // (0) A boolean (1 for true, 0 for false) that enables or disables the web popup feature.
                            webMod: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability of a Web Popup showing after each delay (and closing of Image/Video Popups if that feature is enabled)"},  // (3) Sets the probability (in percentage) of an web popup appearing on each attempt.
                        }
                    },
                    {
                        properties: {
                            useWebCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useHypnoCorruptionLevelConfig: { type: "boolean", title: "Hypno Popup Settings?", default: false },
        },
        dependencies: {
            useHypnoCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useHypnoCorruptionLevelConfig: { const: true },

                            subliminalsChance: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability of Hypno Overlay appearing over an Image/Video Popup"}, // (3) Sets the probability (in percentage) of a popup having a subliminal.
                            subliminalsAlpha: { type: "number", minimum: 0, maximum: 100, default: 20, description: "Opacity of Hypno Overlays. 100 is fully opaque, 0 is fully transparent"}, // (10) Sets the transparency (in percentage) of the subliminals.
                        }
                    },
                    {
                        properties: {
                            useHypnoCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useWallpaperCorruptionLevelConfig: { type: "boolean", title: "Wallpapers Settings?", default: false },
        },
        dependencies: {
            useWallpaperCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useWallpaperCorruptionLevelConfig: { const: true },

                            wallpaperTimer: { type: "number", minimum: 5, maximum: 300, default: 30, description: "Time in seconds before the wallpaper changes to another one (Rotate Wallpapers must be enabled)"}, // (30) Sets the timer (Seconds) to rotate the wallpaper.
                            wallpaperVariance: { type: "number", minimum: 0, maximum: 4, description: "Variance on wallpaper change timing. For example if wallpaperTimer is 5 seconds and wallpaperVariance is 2 seconds, the wallpaper will change every 5±2 seconds (Rotate Wallpapers must be enabled)"},  // (2) Sets the variation between each rotate.
                            // 'wallpaperDat' commented out for now because I don't know how to handle it
                            // wallpaperDat: { type: "string", default: "{'default': 'wallpaper.png'}"}, // ("{'default': 'wallpaper.png', 'Wallpaper (3)': 'Wallpaper (3).png', 'Wallpaper(2)': 'Wallpaper(2).png', 'Wallpaper': 'Wallpaper.png'}") List of every wallpapers
                        }
                    },
                    {
                        properties: {
                            useWallpaperCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useCorruptionCorruptionLevelConfig: { type: "boolean", title: "Corruption Settings?", default: false },
        },
        dependencies: {
            useCorruptionCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useCorruptionCorruptionLevelConfig: { const: true },

                            corruptionTrigger: { type: "string", default: "Timed", enum: ["Timed", "Popup", "Launch", "Script"], description: "Sets how Corruption changes are triggered"}, // (Timed) Sets the Corruption Type. (Timed, Popup, Launch, Script)
                            corruptionWallpaperCycle: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Disable (1) or Enable (0) using Corruption to change wallpapers (unlike most settings, here 1 is Disable and 0 is Enable!)"}, // (0) A boolean (1 for true, 0 for false) that enables or disables the wallpaper cycling between corruption levels.
                            corruptionThemeCycle: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Disable (1) or Enable (0) using Corruption to change Edgeware++ Theme (unlike most settings, here 1 is Disable and 0 is Enable!). Currently this setting does nothing as Theme cannot be changed by Corruption"}, // (0) A boolean (1 for true, 0 for false) that enables or disables the theme cycling between corruption levels.
                            corruptionTime: { type: "number", minimum: 5, maximum: 1800, default: 60, description: "Time in seconds that a Corruption level lasts for (corruption trigger must be set to Timed)"}, // (5) Sets the length of time(Seconds) for corruption to move to the next level.
                            corruptionPopups: { type: "number", minimum: 1, maximum: 100, default: 5, description: "The number of Popups that must appear before transitioning to the next Corruption level (corruption trigger must be set to Popup)"}, 
                            corruptionLaunches: { type: "number", minimum: 2, maximum: 31, default: 2, description: "The number of times Edgeware++ must have been launched before transitioning to the next Corruption level (corruption trigger must be set to Launch)"}, 
                            corruptionFadeType: { type: "string", default: "Normal", enum: ["Normal", "Abrupt"], description: "Controls whether Corruption transition is gradual (Normal) or sudden (Abrupt)"},// (Normal) Sets the Fade type of the corruption. (Normal, Abrupt)
                            corruptionPurityMode: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) Purity Mode, where Corruption progresses in reverse order" }
                        }
                    },
                    {
                        properties: {
                            useCorruptionCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useDenialCorruptionLevelConfig: { type: "boolean", title: "Denial Settings?", default: false },
        },
        dependencies: {
            useDenialCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useDenialCorruptionLevelConfig: { const: true },

                            denialChance: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability that an Image/Video Popup will be censored"}, // (0) Sets the probability (in percentage) for a pop up being censored.
                        }
                    },
                    {
                        properties: {
                            useDenialCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            },
        }
    },
    {
        properties: {
            useNotificationsCorruptionLevelConfig: { type: "boolean", title: "Notifications Settings?", default: false },
        },
        dependencies: {
            useNotificationsCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useNotificationsCorruptionLevelConfig: { const: true },

                            notificationChance: { type: "number", minimum: 0, maximum: 100, default: 0, description: "Probability of an Notification Popup appearing after each delay"}, // (3) Sets the probability (in percentage) of an notification appearing on each pop up attempt.
                            notificationImageChance: { type: "number", minimum: 0, maximum: 100, default: 50, description: "Probability of an image appearing with a Notification Popup"}, // (100) Sets the probability (in percentage) of an image appearing on the notification when it appears.
                        }
                    },
                    {
                        properties: {
                            useNotificationsCorruptionLevelConfig: { const: false }
                        }
                    }
                ]
            }
        }
    },
    {
        properties: {

            useLowkeyModeCorruptionLevelConfig: { type: "boolean", title: "Lowkey Mode Settings?", default: false},
        },
        dependencies: {
            useLowkeyModeCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useLowkeyModeCorruptionLevelConfig: {const: true},
                            
                            lkToggle: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) Lowkey Mode, where Popups only spawn at the corners of the screen" },
                            lkCorner: { type: "number", minimum: 0, maximum: 4, default: 0, enum: [0, 1, 2, 3, 4], description: "Which corner the Popup appears in. 0 = TOP RIGHT, 1 = TOP LEFT, 2 = BOTTOM LEFT, 3 = BOTTOM RIGHT, 4 = RANDOM" },
                        }
                    },
                    {
                        properties: {
                            useLowkeyModeCorruptionLevelConfig: { const: false },
                        }
                    }
                ]
            }            
        }
    },
    {
        properties: {

            useMitosisModeCorruptionLevelConfig: { type: "boolean", title: "Mitosis Mode Settings?", default: false},
        },
        dependencies: {
            useMitosisModeCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useMitosisModeCorruptionLevelConfig: {const: true},
                            
                            mitosisStrength: { type: "number", minimum: 2, maximum: 10, default: 2, description: "The number of new Popups that spawn after a Popup is closed (mitosis mode must be enabled)" }
                        }
                    },
                    {
                        properties: {
                            useMitosisModeCorruptionLevelConfig: { const: false },
                        }
                    }
                ]
            }            
        }
    },
    {
        properties: {

            useHibernateModeCorruptionLevelConfig: { type: "boolean", title: "Hibernate Mode Settings?", default: false},
        },
        dependencies: {
            useHibernateModeCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useHibernateModeCorruptionLevelConfig: {const: true},

                            hibernateType: { type: "string", default: "Original", enum: ["Original", "Spaced", "Glitch", "Ramp", "Pump-Scare", "Chaos"], description: "Set which type of Hibernate Mode to use (hibernate mode must be enabled)"},
                            hibernateMin: { type: "number", minimum: 1, maximum: 7200, default: 240, description: "The minimum number of seconds to wait between Popup activations in Hibernate Mode (hibernate mode must be enabled)" },
                            hibernateMax: { type: "number", minimum: 2, maximum: 14400, default: 300, description: "The maximum number of seconds to wait between Popup activations in Hibernate Mode (hibernate mode must be enabled)" },
                            wakeupActivity: { type: "number", minimum: 1, maximum: 50, default: 20, description: "The maximum number of Popups that spawn per Hibernate Mode activation (hibernate mode must be enabled and hibernate type must be set to Original, Glitch, Ramp or Chaos)" },
                            hibernateLength: { type: "number", minimum: 5, maximum: 300, default: 15, description: "The maximum time in seconds that a Hibernate Mode activation lasts for (hibernate mode must be enabled and hibernate type must be set to Spaced, Glitch, Ramp or Chaos)" },
                            fixWallpaper: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) making the wallpaper \"fixed\". When enabled, wallpaper will be set to panic wallpaper at the end of each Hibernate Mode activation"}, // (0) A boolean (1 for true, 0 for false) that sets the background wallpaper to stay as is. (this is under hibernate mode?)
                        }
                    },
                    {
                        properties: {
                            useHibernateModeCorruptionLevelConfig: { const: false },
                        }
                    }
                ]
            }            
        }
    },
    {
        properties: {
            useBooruCorruptionLevelConfig: { type: "boolean", title: "Booru Settings?", default: false },
        },
        dependencies: {
            useBooruCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useBooruCorruptionLevelConfig: { const: true },

                            downloadEnabled: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) using the Booru Downloader to download images and videos onto user's computer" },
                            tagList: { type: "string", default: "all", description: "List of booru tags separated by spaces, e.g \"pov on_couch text\"" }
                        }
                    },
                    {
                        properties: {
                            useBooruCorruptionLevelConfig: { const: false },
                        }
                    }
                ]
            } 
        }
    },
    {
        properties: {
            useDangerousCorruptionLevelConfig: { type: "boolean", title: "Dangerous Settings?", default: false },
        },
        dependencies: {
            useDangerousCorruptionLevelConfig: {
                oneOf: [
                    {
                        properties: {
                            useDangerousCorruptionLevelConfig: { const: true },
                            
                            fill: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "**DANGEROUS SETTING** Enable (1) or Disable (0) the ability to fill the user's computer with images from the pack" },
                            fill_delay: {type: "number", minimum: 0, maximum: 250, default: 0, description: "**DANGEROUS SETTING** Time interval at which to fill the user's computer in tens of milliseconds (fill drive setting must be enabled)" },
                            panicDisabled: { type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Disable (1) or Enable (0) panic button functionality" }
                        }
                    },
                    {
                        properties: {
                            useDangerousCorruptionLevelConfig: { const: false },
                        }
                    }
                ]
            } 
        }
    }
]

export const fullAppConfigArr: RJSFSchema = [
    {
        properties: {
            useNonCorruptionConfig: {type: "boolean", title: "Non-Corruptible Settings", default: false}
        },
        dependencies: {
            useNonCorruptionConfig: {
                oneOf: [
                    {
                        properties: {
                            useNonCorruptionConfig: {const: true},

                            rotateWallpaper: {type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Rotates wallpapers by choosing from user's own predefined wallpapers (turning this on disables a pack's builtin wallpapers and uses user-defined wallpapers instead)"}, // Rotates wallpaper from user predefined wallpapers
                            themeType: { type: "string", default: "Original", enum: ["Original", "Dark", "The One", "Ransom", "Goth", "Bimbo"], description: "Edgeware++ UI Themes"}, // (Original) Sets the themes for the Edgeware++ Config UI (Original, Dark, The One, Ransom, Goth, Bimbo) (THIS IS HARDCODED AS NON-CORRUPTIBLE IN EDGEWARE CODE)
                            timerMode: {type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "**DANGEROUS SETTING** Enable (1) or Disable (0) Panic Lockout, which disables Panic for a set amount of time"},
                            timerSetupTime: {type: "number", minimum: 1, maximum: 1440, default: 1, description: "**DANGEROUS SETTING** Time in minutes that Panic is disabled for (panic lockout must be enabled)"},
                            replace: {type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "**DANGEROUS SETTING** Enable (1) or Disable (0) the ability for Edgeware++ to PERMANENTLY replace images on user's computer"},
                            replaceThresh: {type: "number", minimum: 1, maximum: 1000, default: 1, description: "**DANGEROUS SETTING** The minimum number of images a folder must have for the images to be replaced (replace images feature must be enabled)"},
                            showDiscord: {type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "**DANGEROUS SETTING** Enable (1) or Disable (0) showing the pack's Discord status message while the pack is being used"},
                            mitosisMode: {type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) Mitosis Mode, which spawns more popups when a popup is closed"},
                            hibernateMode: {type: "number", minimum: 0, maximum: 1, default: 0, enum: [0, 1], description: "Enable (1) or Disable (0) Hibernate Mode, which runs Edgeware++ with no activity and then spawns multiple Popups at once after a set time"},
                        }
                    },
                    {
                        properties: {
                            useNonCorruptionConfig: {const: false} 
                        }
                    }
                ]
            } 
        }
    },
    ...appConfigArr
]
// removed RJSFSchema type from this 
export const corruptionLevelConfigSchema:any = {
    type: "object",
    title: "Corruption Level Settings",
    properties: {
        useCorruptionLevelConfig: { type: "boolean", title: "Level-specific settings?", default: false }
    },
    dependencies: {
        useCorruptionLevelConfig: {
            oneOf: [
                {
                    properties: {
                        useCorruptionLevelConfig: { const: true }, 
                    },
                    allOf: appConfigArr
                },
                {
                    properties: {
                        useCorruptionLevelConfig: { const: false }
                    }
                }
            ]
        }
    }

}

export const genCorruptionSchema = (mdNames: string[]): RJSFSchema => {
    return {
        type: "object",
        title: "CORRUPTION (corruption.json)",
        properties: {
            generate: { type: "boolean", title: "Generate", default: true },
        },
        dependencies: {
            generate: {
                oneOf: [
                    {
                        properties: {
                            generate: { const: true },
                            levels: {
                                type: "array",
                                title: "Corruption Levels",
                                items: {
                                    type: "object",
                                    title: "Level",
                                    properties: {
                                        // only add 'add-moods' and 'remove-moods' if moods have been created
                                        ...((mdNames.length > 0) ? {
                                            "add-moods": {
                                                type: "array",
                                                title: "Add Moods",
                                                items: {
                                                    type: "string",
                                                    enum: [...mdNames]
                                                },
                                                uniqueItems: true
                                            },
                                            "remove-moods": {
                                                type: "array",
                                                title: "Remove Moods",
                                                items: {
                                                    type: "string",
                                                    enum: [...mdNames]
                                                },
                                                uniqueItems: true
                                            },
                                        } : {}),
                                        // wallpaper and config are always present
                                        wallpaper: { type: "string", title: "Wallpaper Filename", description: "The filename of the wallpaper to use for this Level" },
                                        config: {
                                            ...corruptionLevelConfigSchema
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        properties: {
                            generate: { const: false },
                        }
                    }
                ]
            }
        }
    }
}

export const bareCorruptionSchema = ():RJSFSchema => {

    return genCorruptionSchema([]);
}

export const ewSchema: RJSFSchema = {
    title: "Edgeware Pack Settings (pack.yml)",
    type: "object",
    properties: {
        info: {
            type: "object",
            title: "PACK INFO (info.json)",
            required: ["name", "id", "creator", "version", "description"],
            properties: {
                generate: { type: "boolean", title: "Generate", default: true},
            },
            dependencies: {
                generate: {
                    oneOf: [
                        {
                            properties: {
                                generate: { const: true},
                                name: { type: "string", title: "Pack Name", default: "Pack name"},
                                id: { type: "string", title: "Pack ID", default: "PackID", description: "Prefix for the ID string used to identify your pack in Edgeware++"},
                                creator: { type: "string", title: "Pack Creator", default: "Your name"},
                                version: { type: "string", title: "Pack Version", default: "1.0"},
                                description: { type: "string", title: "Pack Description", default: "Describe your pack"},
                            }
                        },
                        {
                            properties: {
                                generate: { const: false }
                            }
                        }
                    ]
                }
            }
        },
        discord: {
            type: "object",
            title: "DISCORD (discord.dat)",
            properties: {
                generate: { type: "boolean", title: "Generate", default: true },
            },
            dependencies: {
                generate: {
                    oneOf: [
                        {
                            properties: {
                                generate: { const: true },
                                status: { type: "string", default: "I'm playing with Edgeware++!", description: "The user's Discord status while running your pack"},
                            }

                        },
                        {
                            properties: {
                                generate: { const: false },
                            }
                        }
                    ]
                }
            }
        },
        config: {
            type: "object",
            title: "EDGEWARE APP SETTINGS (config.json)",
            properties: {
                generate: { type: "boolean", title: "Generate", default: false}
            },
            dependencies: {
                // typescript error here but it works...
                generate: {
                    oneOf: [
                        {
                            properties: {
                                generate: {const: true},
                                raw: {
                                    type: "object",
                                    title: "Edgeware Settings",
                                    allOf: fullAppConfigArr
                                }
                            }, 
                        },
                        {
                            properties: {
                                generate: {const: false}
                            }
                        }
                    ]
                }
            }
        },
        index: {
            type: "object",
            title: "MAIN PACK SETTINGS (index.json)",
            properties: {
                generate: { type: "boolean", title: "Generate", default: true },
            },
            dependencies: {
                generate: {
                    oneOf: [
                        {
                            properties: {
                                generate: { const: true },
                                default: {
                                    title: "Default Mood Settings",
                                    ...moodPropsSchema,
                                    properties: {
                                        "prompt-command": { type: "string", title: "Prompt Command", default: "Type for me!", description: "The instruction given to the user when a Prompt Popup appears"},
                                        "prompt-submit": { type: "string", title: "Prompt Submit Button", default: "I obey fake viruses!", description: "The label for a Prompt Popup's 'submit' button" },
                                        "prompt-min-length": { type: "number", title: "Prompt Min Length", default: 1, description: "Minimum number of times that the given prompt must be typed out"},
                                        "prompt-max-length": { type: "number", title: "Prompt Max Length", default: 1, description: "Maximum number of times that the given prompt must be typed out"},
                                        ...moodPropsSchema.properties,
                                        mood: { type: "string", title: "Mood", default: "default", readOnly: true, description: "The default mood in your pack (always active)"},
                                    }
                                },
                                moods: {
                                    type: "array",
                                    title: "Moods",
                                    items: {
                                        title: "Mood",
                                        ...moodPropsSchema
                                    }
                                }
                            }
                        },
                        {
                            properties: {
                                generate: { const: false },
                            }
                        }
                    ]
                }
            }
        },
        corruption: {
            ...bareCorruptionSchema()
        }
    }
}
