import { createRef, useEffect, useRef, useState } from 'react'
import './App.css'
import './form-extras.css'

import hslToHex from "hsl-to-hex";
import {clsx} from "clsx";
import * as lodash from 'lodash';
import {parse, stringify} from 'yaml'

import Form from '@rjsf/daisyui';
import { type RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import type { IChangeEvent } from '@rjsf/core';

import { bareCorruptionSchema, corruptionLevelConfigSchema, ewSchema, genCorruptionSchema } from './schemas'
import { applyAllCorruptionLevelDefaults, reintroduceFlagsInConfigObj, reintroduceFormFlags } from './pre-processing'

import PackFileUploadZone from './components/PackFileUploadZone';
import SpinLoader from './components/SpinLoader';
import ActionButton from './components/ActionButton';
import { deleteSiblingsOfFalseKey, introduceEmptyMoodsToIndex } from './post-processing';
import ToolTipPatcher from './components/ToolTipPatcher';
import InfoModal from './components/InfoModal';

function App() {
  
  enum ReparentMode {
    NONE,
    NORMAL,
    CORRUPTION_TOP,
    MOOD_SUBTITLE
  }
  interface CollapseButtonOptions {
    useExplicitSizing?: boolean; 
    elementWithTitleIDForLoaderButtons?: HTMLElement; 
    moodNamePair?: {
      moodLabel: HTMLParagraphElement,
      moodInput: HTMLInputElement
    }; 
    reparent?: ReparentMode
  }

  const appConfigUISettings = {
    delay: {
      "ui:widget": "range"
    },
    lkScaling: {
      "ui:widget": "range"
    },
    movingChance: {
      "ui:widget": "range"
    },
    movingSpeed: {
      "ui:widget": "range"
    },
    popupTimeout: {
      "ui:widget": "range"
    },
    popupMod: {
      "ui:widget": "range"
    },
    audioMod: {
      "ui:widget": "range"
    },
    maxAudio: {
      "ui:widget": "range"
    },
    audioVolume: {
      "ui:widget": "range"
    },
    fadeInDuration: {
      "ui:widget": "range"
    },
    fadeOutDuration: {
      "ui:widget": "range"
    },
    vidMod: {
      "ui:widget": "range"
    },
    maxVideos: {
      "ui:widget": "range"
    },
    videoVolume: {
      "ui:widget": "range"
    },
    capPopChance: {
      "ui:widget": "range"
    },
    capPopOpacity: {
      "ui:widget": "range"
    },
    capPopTimer: {
      "ui:widget": "range"
    },
    promptMod: {
      "ui:widget": "range"
    },
    promptMistakes: {
      "ui:widget": "range"
    },
    webMod: {
      "ui:widget": "range"
    },
    subliminalsChance: {
      "ui:widget": "range"
    },
    subliminalsAlpha: {
      "ui:widget": "range"
    },
    wallpaperTimer: {
      "ui:widget": "range"
    },
    wallpaperVariance: {
      "ui:widget": "range"
    },
    corruptionTime: {
      "ui:widget": "range"
    },
    corruptionPopups: {
      "ui:widget": "range"
    },
    corruptionLaunches: {
      "ui:widget": "range"
    },
    denialChance: {
      "ui:widget": "range"
    },
    notificationChance: {
      "ui:widget": "range"
    },
    notificationImageChance: {
      "ui:widget": "range"
    },
    mitosisStrength: {
      "ui:widget": "range"
    },
    hibernateMin: {
      "ui:widget": "range"
    },
    hibernateMax: {
      "ui:widget": "range"
    },
    wakeupActivity: {
      "ui:widget": "range"
    },
    hibernateLength: {
      "ui:widget": "range"
    },
    fill_delay: {
      "ui:widget": "range"
    },
  }

  const fullAppConfigUISettings = {
    timerSetupTime: {
      "ui:widget": "range"
    },
    replaceThresh: {
      "ui:widget": "range"
    },
    ...appConfigUISettings
  }
  
  const theUISchema = {
    info: {
      description: {
        "ui:widget": "textarea"
      }
    },
    index: {
      moods: {
        "ui:options": {
          orderable: false
        }
      }
    },
    config: {
      raw: fullAppConfigUISettings
    },
    corruption: {
      levels: {
        items:{
          "add-moods": {
            "ui:widget": "checkboxes"
          },
          "remove-moods": {
            "ui:widget": "checkboxes"
          },
          config: appConfigUISettings 
        }
      },
    },
    "ui:submitButtonOptions": {
      submitText: "Generate pack.yml",
      norender: true,
      // className styling doesn't work for some reason...
      props: {
        className: "btn btn-success"
      }
    }
  }

  const [yamlOutput, setYamlOutput] = useState<string>("");
  const [formSchema, setFormSchema] = useState<RJSFSchema>(ewSchema);
  const [uiSchema, setUISchema] = useState(theUISchema);
  const [moodNames, setMoodNames] = useState<string[]>([]);
  const [formData, setFormData] = useState({} as any);
  const [formIndexGenerate, setFormIndexGenerate] = useState(true);
  const [useLightMode, setUseLightMode] = useState(false);
  const [formDataJustUploaded, setFormDataJustUploaded] = useState(false);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [initSubmitHappened, setInitSubmitHappened] = useState(false);
  const [moodCols, setMoodCols] = useState([] as string[]);
  const [corruptionLevelCols, setCorruptionLevelCols] = useState([] as string[]);
  const [loaderButtonsEnabled, setLoaderButtonsEnabled] = useState(true);
  const [shortcutButtonsEnabled, setShortcutButtonsEnabled] = useState(true);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  
  const formDataStateRef = useRef({formData});
  const colArrStatesRef = useRef({moodCols, corruptionLevelCols});
  
  const outputSectionRef = useRef(null);
  const patchButtonListenerAdded = useRef(false);
  const moodColIndexOffset = 9;

  const [collapseButtonsGlobal, setCollapseButtonsGlobal] = useState([] as HTMLDivElement[]);
  
  const formRef = useRef<any>(null);
  
  useEffect(() => {
    // DaisyUI messes with unfocusing of dropdown elements after clicking on them. This tries to fix that
    document.addEventListener("click", (e) => patchDropdownFocusBug(e));

    return () => document.removeEventListener("click", (e) => patchDropdownFocusBug(e));
  }, []);

  useEffect(() => {
    
    if(patchButtonListenerAdded.current) {
      return;
    }
    patchButtonListenerAdded.current = true;
    // using this to intercept the events for reordering buttons
    document.addEventListener("click", (e) => patchButtons(e), true);
    return () => document.removeEventListener("click", (e) => patchButtons(e), true);
  }, []);

  useEffect(() => {
    formDataStateRef.current = {formData};
  }, [formData]);

  useEffect(() => {
    colArrStatesRef.current = {moodCols, corruptionLevelCols};
  }, [moodCols, corruptionLevelCols]);

  useEffect(() => {
    refreshStylingExtras();
  }, [useLightMode]);

  useEffect(() => {
    if(formDataJustUploaded)
    {
      // using this setTimeout trick to make sure the callback runs after render
      const id = setTimeout(() => {
        // forcing this call because sometimes RSJF doesn't call it when data changes
        handleChange(null, "", formData);

        refreshStylingExtras();
        setFormDataJustUploaded(false);

        alert("YAML data processed successfully!");
      }, 0);

      return () => {
        clearTimeout(id);
      };
    }
  }, [formDataJustUploaded])

  useEffect(() => {
    debouncedMoodChangeHandle();
  }, [moodNames]);

  const patchDropdownFocusBug = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const dropdownContent = target.closest(".dropdown-content") as HTMLElement;

    if (dropdownContent) {
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement && dropdownContent.contains(document.activeElement)) {
          document.activeElement.blur();
        }
      }, 0);
    }

  }

  const patchButtons = (e: MouseEvent) => {

    const target = e.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const button = target.closest("button") as HTMLButtonElement;
    if (button) {
      handleArrayChangeClick(button);
    }
    else {
      // console.log("No button");
    }
  }

  const refreshStylingExtras = () => {
    addCollapseButtonsToSections();
    applyMoodColChanges();
    applyCorruptionColChanges();

    document.body.style.backgroundColor = (useLightMode) ? "#b1ecfd" : "#35374d";
  }

  const genBackgroundCol = (index:number, isLightMode:boolean, isMoodCol:boolean) => {
    // check if to generate new col or use existing one from array

    // use from existing arrays
    if((isMoodCol && moodCols.length > index) || (!isMoodCol && corruptionLevelCols.length > index)) {
      if(isMoodCol) {
        return moodCols[index];
      }
      else {
        return corruptionLevelCols[index];
      }
    }
    // generate new col
    else {

      let colIndex:number;
      if(isMoodCol) {
        colIndex = index + moodColIndexOffset;
      }
      else {
        colIndex = index;
      }
      const goldenAngle = 137.508;
  
      let lightness = (isLightMode) ? 85 : 30;
      let saturation = (isLightMode) ? 40 : 20;
  
      let hue = 0.0;
  
      for(let i = 0; i < colIndex+1; i++)
      {
        hue = (hue + goldenAngle) % 360;
      }
  
      const col = hslToHex(hue, saturation, lightness);

      // update state variables before returning the col
      if(isMoodCol) {
        const newMoodColArr = [...moodCols, col];
        setMoodCols(newMoodColArr);
      }
      else {
        const newCorruptionLevelColArr = [...corruptionLevelCols, col];
        setCorruptionLevelCols(newCorruptionLevelColArr);
      }
  
      return col;
    }
  }

  const deleteBaseConfigFlags = (obj:any) => {

    // if config is set to generate, then do this manual clean up. Else flags are cleaned up with other false "generate" siblings
    if(obj["config"]["generate"])
    {
      deleteUnusedCustomConfigFlagOptions(obj["config"]["raw"]);
      cleanupCustomConfigFlags(obj["config"]["raw"]);
    }

    return obj;
  }

  const deleteCorruptionLevelConfigFlags = (obj:any) => {
    
    const levelsArr = obj.corruption.levels;
    if(levelsArr)
    {
      for(let i = 0; i < levelsArr.length; ++i)
      {
        if (! levelsArr[i]["config"]["useCorruptionLevelConfig"])
        {
          levelsArr[i]["config"] = deleteSiblingsOfFalseKey(levelsArr[i]["config"], "useCorruptionLevelConfig");
        }
        else
        {
          deleteUnusedCustomConfigFlagOptions(levelsArr[i]["config"])
        }
        // delete all 'use...?' flags for this level after done with above checks
        cleanupCustomConfigFlags(levelsArr[i]["config"]);
      }
  
      obj.corruption.levels = levelsArr;
    }

    return obj;
  }

  const deleteUnusedCustomConfigFlagOptions = (customConfigsObj: any) => {

    if (!customConfigsObj["useNonCorruptionConfig"]) {
      delete customConfigsObj["rotateWallpaper"];
      delete customConfigsObj["themeType"];
      delete customConfigsObj["timerMode"];
      delete customConfigsObj["timerSetupTime"];
      delete customConfigsObj["replace"];
      delete customConfigsObj["replaceThresh"];
      delete customConfigsObj["showDiscord"];
      delete customConfigsObj["mitosisMode"];
      delete customConfigsObj["hibernateMode"];
    }

    if (!customConfigsObj["usePopupsCorruptionLevelConfig"]) {
      delete customConfigsObj["delay"];
      delete customConfigsObj["singleMode"];
      delete customConfigsObj["showCaptions"];
      delete customConfigsObj["buttonless"];
      delete customConfigsObj["lkScaling"];
      delete customConfigsObj["movingChance"];
      delete customConfigsObj["movingSpeed"];
      delete customConfigsObj["timeoutPopups"];
      delete customConfigsObj["popupTimeout"];
      delete customConfigsObj["multiClick"];
      delete customConfigsObj["clickthroughPopups"];
    }

    if (!customConfigsObj["useImagesCorruptionLevelConfig"]) {
      delete customConfigsObj["popupMod"];
    }

    if (!customConfigsObj["useAudioCorruptionLevelConfig"]) {
      delete customConfigsObj["audioMod"];
      delete customConfigsObj["maxAudio"];
      delete customConfigsObj["audioVolume"];
      delete customConfigsObj["fadeInDuration"];
      delete customConfigsObj["fadeOutDuration"];
    }

    if (!customConfigsObj["useVideosCorruptionLevelConfig"]) {
      delete customConfigsObj["vidMod"];
      delete customConfigsObj["maxVideos"];
      delete customConfigsObj["videoVolume"];
    }

    if (!customConfigsObj["useSubliminalsCorruptionLevelConfig"]) {
      delete customConfigsObj["capPopChance"];
      delete customConfigsObj["capPopOpacity"];
      delete customConfigsObj["capPopTimer"];
    }

    if (!customConfigsObj["usePromptsCorruptionLevelConfig"]) {
      delete customConfigsObj["promptMod"];
      delete customConfigsObj["promptMistakes"];
    }

    if (!customConfigsObj["useWebCorruptionLevelConfig"]) {
      delete customConfigsObj["webPopup"];
      delete customConfigsObj["webMod"];
    }

    if (!customConfigsObj["useHypnoCorruptionLevelConfig"]) {
      delete customConfigsObj["subliminalsChance"];
      delete customConfigsObj["subliminalsAlpha"];
    }

    if (!customConfigsObj["useWallpaperCorruptionLevelConfig"]) {
      delete customConfigsObj["wallpaperTimer"];
      delete customConfigsObj["wallpaperVariance"];
      delete customConfigsObj["wallpaperDat"];
    }

    if (!customConfigsObj["useCorruptionCorruptionLevelConfig"]) {
      delete customConfigsObj["corruptionTrigger"];
      delete customConfigsObj["corruptionWallpaperCycle"];
      delete customConfigsObj["corruptionThemeCycle"];
      delete customConfigsObj["corruptionTime"];
      delete customConfigsObj["corruptionPopups"];
      delete customConfigsObj["corruptionLaunches"];
      delete customConfigsObj["corruptionFadeType"];
      delete customConfigsObj["corruptionPurityMode"];
    }

    if (!customConfigsObj["useDenialCorruptionLevelConfig"]) {
      delete customConfigsObj["denialChance"];
    }

    if (!customConfigsObj["useNotificationsCorruptionLevelConfig"]) {
      delete customConfigsObj["notificationChance"];
      delete customConfigsObj["notificationImageChance"];
    }

    if (!customConfigsObj["useLowkeyModeCorruptionLevelConfig"]) {
      delete customConfigsObj["lkToggle"];
      delete customConfigsObj["lkCorner"];
    }

    if (!customConfigsObj["useMitosisModeCorruptionLevelConfig"]) {
      delete customConfigsObj["mitosisStrength"];
    }

    if (!customConfigsObj["useHibernateModeCorruptionLevelConfig"]) {
      delete customConfigsObj["hibernateType"];
      delete customConfigsObj["hibernateMin"];
      delete customConfigsObj["hibernateMax"];
      delete customConfigsObj["wakeupActivity"];
      delete customConfigsObj["hibernateLength"];
      delete customConfigsObj["fixWallpaper"];
    }

    if (!customConfigsObj["useBooruCorruptionLevelConfig"]) {
      delete customConfigsObj["downloadEnabled"];
      delete customConfigsObj["tagList"];
    }

    if (!customConfigsObj["useDangerousCorruptionLevelConfig"]) {
      delete customConfigsObj["fill"];
      delete customConfigsObj["fill_delay"];
      delete customConfigsObj["panicDisabled"];
    }
  }

  const removeEmptyArgsFromImportData = (importDataObj:any) => {
    for(let i = 0; i < importDataObj?.index?.moods?.length; i++) {
      const mood = importDataObj.index.moods[i];

      if(mood.hasOwnProperty("web")) {
        for(const webObj of mood.web) {
          // removing empty args on import because they mess with RSJF validator
          if(webObj.hasOwnProperty("args")) {
            for(let j = 0; j < webObj.args.length; j++) {
              if(! webObj.args[j]) {
                webObj.args.splice(j, 1);
              }
            }
          }
        }
      }
    }
    
  }

  const handleEmptyArgsFromWebLinks = (formDataObj:any) => {

    for(let i = 0; i < formDataObj?.index?.moods?.length; i++) {
      const mood = formDataObj.index.moods[i];

      if(mood.hasOwnProperty("web")) {
        for(const webObj of mood.web) {
          // doing this because Edgeware++ always expects an args array exists, so if we don't want args just pass in empty single value
          if(! webObj.hasOwnProperty("args") || (webObj.hasOwnProperty("args") && webObj.args.length < 1)) {
            webObj["args"] = [""];
          }
        }
      }
    }

    return formDataObj;
  }

  const cleanupCustomConfigFlags = (customConfigsObj:any) => {
    delete customConfigsObj["useCorruptionLevelConfig"];

    delete customConfigsObj["useNonCorruptionConfig"];

    delete customConfigsObj["usePopupsCorruptionLevelConfig"];
    delete customConfigsObj["useImagesCorruptionLevelConfig"];
    delete customConfigsObj["useAudioCorruptionLevelConfig"];
    delete customConfigsObj["useVideosCorruptionLevelConfig"];
    delete customConfigsObj["useSubliminalsCorruptionLevelConfig"];
    delete customConfigsObj["usePromptsCorruptionLevelConfig"];
    delete customConfigsObj["useWebCorruptionLevelConfig"];
    delete customConfigsObj["useHypnoCorruptionLevelConfig"];
    delete customConfigsObj["useWallpaperCorruptionLevelConfig"];
    delete customConfigsObj["useCorruptionCorruptionLevelConfig"];
    delete customConfigsObj["useDenialCorruptionLevelConfig"];
    delete customConfigsObj["useNotificationsCorruptionLevelConfig"];
    delete customConfigsObj["useLowkeyModeCorruptionLevelConfig"];
    delete customConfigsObj["useMitosisModeCorruptionLevelConfig"];
    delete customConfigsObj["useHibernateModeCorruptionLevelConfig"];
    delete customConfigsObj["useBooruCorruptionLevelConfig"];
    delete customConfigsObj["useDangerousCorruptionLevelConfig"];
  }

  const cleanFormData = (formData:any) => {
    const moodedData = introduceEmptyMoodsToIndex(formData);
    const dedupFormData = deleteSiblingsOfFalseKey(moodedData, "generate");
    const dedupBaseConfigData = deleteBaseConfigFlags(dedupFormData);
    const formDataWithCleanWebLinks = handleEmptyArgsFromWebLinks(dedupBaseConfigData);
    const cleanFormData = deleteCorruptionLevelConfigFlags(formDataWithCleanWebLinks);
    
    return cleanFormData;
  }

  const setDefaultFormSchema = () => {
    setFormSchema(
      (prevSchema) => ({
        ...prevSchema,
        properties: {
          ...prevSchema.properties,
          corruption: {
            ...bareCorruptionSchema()
          }
        }
      })
    );
  }

  const arraysEqualShallow = (a:string[], b:string[]):{isEqual:boolean; unequalIndex:number} => {
    if(a.length !== b.length) {
      return {
        isEqual: false,
        unequalIndex: -1
      }
    }
    
    for(let i = 0; i < a.length; i++) {

      if(a[i] !== b[i]) {
        return {
          isEqual: false,
          unequalIndex: i
        }
      }
    }
    return {
      isEqual: true,
      unequalIndex: -1
    }
  }

  const debounce = (func:any, delay:number) => {
    let timeout:number;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    }
  }

  const handleMoodChange = () => {
    console.log(`mood length: ${moodNames?.length}`);
    if (moodNames?.length > 0) {
      setFormSchema(
        (prevSchema) => ({
          ...prevSchema,
          properties: {
            ...prevSchema.properties,
            corruption: genCorruptionSchema(moodNames)
          }
        })
      );
    }
  }

  const debouncedMoodChangeHandle = debounce(handleMoodChange, 500);

  const corruptionLevelDefaultsApplyManager = (formData:any, elementID:string|undefined) => {

    // new level added, so get the object for the latest level and set defaults
    if (elementID === "root_corruption_levels")
    {
      const numLevels = formData.corruption.levels.length;
      if(numLevels > 0)
      {
        const addedLevelConfigObj = formData.corruption.levels[numLevels-1].config;
        applyAllCorruptionLevelDefaults(addedLevelConfigObj, false);
      }
    }

    // this is for the global config options for the app (config.json)
    if (elementID === "root_config_generate")
    {
      if(! formData.config.hasOwnProperty("raw"))
      {
        formData.config.raw = {};
        applyAllCorruptionLevelDefaults(formData.config.raw, true);
      }
    }
  }

  const setCollapseButtonAboveTitle = (title:string, addExtraButtons:boolean = false) => {
    // !!! this function assumes that the title 100% already exists in the document
    const { contentHolderElement, formControlSectionElement, titleHolderElement } = getElementsFromSectionTitle(title);
    const additionalOptionsObj:CollapseButtonOptions = {
      // useExplicitSizing: true,
      elementWithTitleIDForLoaderButtons: (addExtraButtons) ? titleHolderElement : undefined,
      reparent: ReparentMode.NORMAL
    }
    applyCollapseButton(formControlSectionElement, contentHolderElement, additionalOptionsObj);
  }

  const getElementsFromSectionTitle = (title:string):{
    titleHolderElement:HTMLElement,
    contentHolderElement:HTMLElement
    formControlSectionElement:HTMLElement
  } => {
    const titleHolderElement = document.getElementById(title) as HTMLDivElement;
    
    const contentHolderElement = titleHolderElement.nextSibling as HTMLDivElement;

    let formControlSectionElement;
    
    if(titleHolderElement.dataset.moved === "moved") {
      formControlSectionElement = titleHolderElement.parentElement!.parentElement as HTMLDivElement;
    }
    else {
      formControlSectionElement = titleHolderElement.parentElement as HTMLDivElement;
    }


    return {
      titleHolderElement,
      contentHolderElement,
      formControlSectionElement
    }
  }

  const addCollapseButtonsToSections = () => {

    const sectionTitlesArr = [
      "root_info__title",
      "root_discord__title",
      "root_corruption__title",
    ]

    for(let i = 0; i < sectionTitlesArr.length; i++)
    {
      setCollapseButtonAboveTitle(sectionTitlesArr[i]);
    }


    // the config section is special case because we need to generate import/export buttons for it
    setCollapseButtonAboveTitle("root_config__title", true);

    //  index section is a special case because of all its sub-sections which may not render if generate is false
    const indexDefaultTitleHolderElement = document.getElementById("root_index_default__title");
    if(indexDefaultTitleHolderElement)
    {
      // this is for the root_index
      setCollapseButtonAboveTitle("root_index__title");

      // this is for the root_index_default
      setCollapseButtonAboveTitle("root_index_default__title");

      // this is for the moods under root_index_default
      applyCollapseButtonsToMoodSubsections("root_index_default");
    }

  }

  const handleSaveConfig = (elementWithTitleID:HTMLElement) => {
    const isForCorruptionConfig = elementWithTitleID.id.startsWith("root_corruption_levels_");
    const currFormData = formDataStateRef.current.formData;
    
    let blob:Blob;
    let configName:string;
    let dataToSave;
    if (isForCorruptionConfig) {
      const id = elementWithTitleID.id;
      const levelIndex = parseInt(id.split('_')[3]);

      if(currFormData.corruption.levels[levelIndex].hasOwnProperty("config") && currFormData.corruption.levels[levelIndex].config.useCorruptionLevelConfig) {

        dataToSave = JSON.parse(JSON.stringify(currFormData.corruption.levels[levelIndex].config));
        configName = `Level ${levelIndex + 1}`;
      }
      else {
        alert("There is no data to export")
        return;
      }
    }
    else {
      if(currFormData.config.hasOwnProperty("raw") && currFormData.config.generate) {
        dataToSave = JSON.parse(JSON.stringify(currFormData.config.raw));
        configName = "App Config";
      }
      else {
        alert("There is no data to export")
        return;
      }
    }

    deleteUnusedCustomConfigFlagOptions(dataToSave);
    cleanupCustomConfigFlags(dataToSave);

    // check that object is not empty after stripping
    if(Object.keys(dataToSave).length < 1) {
      alert("There is no data to export")
      return;
    }

    blob = new Blob([JSON.stringify(dataToSave, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    // create temp anchor
    const tempAnchor = document.createElement("a");
    tempAnchor.href = url;

    const rawPackName = currFormData?.info?.name;
    const rawFileName = `${rawPackName} ${configName}`;
    const fileName = lodash.camelCase(rawFileName);
    tempAnchor.download = `${fileName}.json`;

    // trigger download
    document.body.appendChild(tempAnchor);
    tempAnchor.click();
    
    // clean up
    document.body.removeChild(tempAnchor);
    URL.revokeObjectURL(url);

  }
  const handleLoadConfig = (elementWithTitleID:HTMLElement, ev:Event) => {
    const file:File = ev.target?.files[0];

    if(!file) {
      alert("File invalid");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (readerEvent) => {
      try {
        let fileData;
        const fileText = readerEvent.target?.result as string;

        if (file.type === "application/x-yaml") {
          try {
            fileData = parse(fileText);
          }
          catch(err) {
            alert("Failed to parse YAML file!");
            setIsLoaderActive(false);
            console.error("Failed to parse YAML file!" + err);
            return;
          }

          const hasCorrectFormat = fileData.hasOwnProperty("config") && fileData.config.hasOwnProperty("raw");
          
          if(! hasCorrectFormat) {
            alert("Config YAML file is not formatted correctly!")
            setIsLoaderActive(false);
            return;
          }
        }
        else {
          try {
            fileData = JSON.parse(fileText);
          }
          catch(err) {
            alert("Failed to parse .json file!");
            setIsLoaderActive(false);
            console.error("Failed to parse .json file!" + err);
            return;
          }
        }

        // if we are here, we assume that the file is valid
        const newFormData = JSON.parse(JSON.stringify(formDataStateRef.current.formData));
        const isForCorruptionConfig = elementWithTitleID.id.startsWith("root_corruption_levels_");

        if(isForCorruptionConfig) {
          const id = elementWithTitleID.id;
          const levelIndex = parseInt(id.split('_')[3]);
          reintroduceFlagsInConfigObj(fileData, true);
          newFormData.corruption.levels[levelIndex]["config"]= fileData;
        }
        else {
          newFormData.config["generate"] = true;
          reintroduceFlagsInConfigObj(fileData, false);
          newFormData.config["raw"] = fileData;
        }

        setFormData(newFormData);
        setIsLoaderActive(false);
        alert("Configuration data loaded!");
      }
      catch(err) {

        setIsLoaderActive(false);
        alert("Failed to parse config file");
        console.error("Failed to parse config file: " + err);
      }
    }

    setIsLoaderActive(true);
    fileReader.readAsText(file);
  }

  const applyCollapseButton = (holderElement:HTMLElement, elementToHide:HTMLElement, additionalOptions:CollapseButtonOptions = {useExplicitSizing: false,elementWithTitleIDForLoaderButtons:undefined, moodNamePair:undefined, reparent:ReparentMode.NONE}) => {

    if (holderElement.dataset.collapsePatched === "patched") {
      return;
    }
    else {
      holderElement.dataset.collapsePatched = "patched"
    }

    let buttonHolder:HTMLElement|undefined|null;

    // if this is truthy, we want to add import/export buttons here
    if(loaderButtonsEnabled && additionalOptions.elementWithTitleIDForLoaderButtons) {

      additionalOptions.elementWithTitleIDForLoaderButtons.classList.remove("mb-6");

      buttonHolder = document.createElement("div");
      // keeping this old className string for debugging 
      // buttonHolder.className = "border-4 bg-base-300 hover:bg-base-100 border-secondary hover:border-accent rounded-box collapse_button flex justify-evenly";
      buttonHolder.className = "flex justify-evenly";
      buttonHolder.setAttribute("style", "font-size: 2rem; margin: 0 auto; cursor: pointer; user-select: none");
      buttonHolder.style.width = "90%";
      
      const saveButton = document.createElement("div");
      saveButton.innerHTML = "Export<br/>config.json";
      const loadButton = document.createElement("div");
      const loadButtonInput = document.createElement("input");
      loadButtonInput.type = "file";
      loadButtonInput.accept = ".json";
      loadButtonInput.onchange = ((ev) => handleLoadConfig(additionalOptions.elementWithTitleIDForLoaderButtons!, ev));
      loadButtonInput.style.display = "none";
      loadButton.innerHTML = "Import<br/>config.json";
      loadButton.appendChild(loadButtonInput);


      const loaderButtonClasses = "border-4 bg-base-300 hover:bg-base-100 border-secondary hover:border-accent rounded-box grow my-2 ";

      const loaderButtonStyles = "display: inline-block; font-size: 1.5rem; margin-right: 5px; cursor: pointer; user-select: none";

      saveButton.className = loaderButtonClasses;
      saveButton.className += "border-success";
      loadButton.className = loaderButtonClasses;
      loadButton.className += "relative border-warning "
      saveButton.setAttribute("style", loaderButtonStyles);
      loadButton.setAttribute("style", loaderButtonStyles);

      saveButton.onclick = (() => handleSaveConfig(additionalOptions.elementWithTitleIDForLoaderButtons!));
      loadButton.onclick = (() => loadButtonInput.click());
      buttonHolder.appendChild(saveButton);
      buttonHolder.appendChild(loadButton);

      holderElement.prepend(buttonHolder);
    }

    // create collapse button
    const collapseButton = document.createElement("div");
    collapseButton.className = "border-4 bg-base-300 hover:bg-base-100 border-secondary hover:border-accent rounded-box collapse_button flex content-start";
    collapseButton.innerHTML = "▼";
    collapseButton.setAttribute("style", "display: inline-block; font-size: 2rem; margin-right: 8px; cursor: pointer; user-select: none");

    // useExplicitSizing is from when collapse buttons were still horizontal. not useful now
    if(additionalOptions.useExplicitSizing)
    {
      collapseButton.style.width = "90%"; 
      collapseButton.style.boxSizing = "content-box";
      collapseButton.style.margin = "10px";
    }

    collapseButton.onclick = (event) => collapseButtonHandler(collapseButton, elementToHide, buttonHolder, additionalOptions);
    
    if(additionalOptions.reparent === ReparentMode.NORMAL) {
      
      const newParent = document.createElement("div");
      newParent.className = "TESTING flex-grow";

      let titleDivElement;
      if(loaderButtonsEnabled && additionalOptions.elementWithTitleIDForLoaderButtons) {
        const configButtonsRow = holderElement.children[0] as HTMLDivElement;
        titleDivElement = additionalOptions.elementWithTitleIDForLoaderButtons;

        newParent.append(titleDivElement);
        newParent.append(configButtonsRow);
      }
      else {
        titleDivElement = holderElement.children[0] as HTMLDivElement;
        newParent.append(titleDivElement);
      }

      newParent.append(elementToHide);

      titleDivElement.dataset.moved = "moved";

      holderElement.className += "flex";

      holderElement.append(collapseButton);
      holderElement.append(newParent);

    }
    else if (additionalOptions.reparent === ReparentMode.CORRUPTION_TOP) {
      const newParent = document.createElement("div");
      newParent.className = "TESTING flex-grow";
      
      const titleDivElement = additionalOptions.elementWithTitleIDForLoaderButtons!;
      titleDivElement.dataset.moved = "moved";

      const innerNewParent = document.createElement("div");
      innerNewParent.className = "INNER-TESTING flex-grow";

      newParent.append(titleDivElement);
      newParent.append(innerNewParent);

      const configButtonsRow = holderElement.children[0] as HTMLDivElement;
      
      const beforeElem = holderElement.children[1].children[0].children[0].children[0].children[1];
      const beforeElemParent = beforeElem.parentElement!;
      beforeElemParent.insertBefore(configButtonsRow, beforeElem);

      innerNewParent.append(elementToHide);

      holderElement.className += "flex";

      holderElement.prepend(newParent);
      holderElement.prepend(collapseButton);

    }
    else if(additionalOptions.reparent === ReparentMode.MOOD_SUBTITLE) {
      const newParent = document.createElement("div");
      newParent.className = "TESTING flex";
      const titleDivElement = elementToHide.children[0] as HTMLElement;
      titleDivElement.dataset.moved = "moved";
      const descriptionDivElement = elementToHide.children[1] as HTMLElement;
      
      const innerNewParent = document.createElement("div");
      innerNewParent.className = "INNER-TESTING flex-grow";
      
      innerNewParent.append(titleDivElement);
      innerNewParent.append(descriptionDivElement);
      innerNewParent.append(elementToHide);
      
      newParent.append(collapseButton);
      newParent.append(innerNewParent);
      
      holderElement.prepend(newParent);
    }
    else {
      holderElement.prepend(collapseButton);
    }
    
    holderElement.dataset.collapsePatched = "patched";
    setCollapseButtonsGlobal([
      ...collapseButtonsGlobal,
      collapseButton
    ])
    collapseButtonsGlobal.push(collapseButton);

    // uncomment below if we want to hide everything by default
    // collapseButtonHandler(collapseButton, elementToHide, buttonHolder, additionalOptions);

  }

  const collapseButtonHandler = (collapseButton:HTMLDivElement, elementToHide:HTMLElement, buttonHolder:HTMLElement|null|undefined, additionalOptions:any) => {
    if (collapseButton.innerHTML === "▶") {
      collapseButton.classList.remove("border-primary");
      collapseButton.classList.remove("content-center");
      collapseButton.classList.add("border-secondary");
      collapseButton.classList.add("content-start");
      if (additionalOptions.moodNamePair) {
        additionalOptions.moodNamePair.moodLabel.hidden = true;
      }
    }
    else {
      collapseButton.classList.add("border-primary");
      collapseButton.classList.add("content-center");
      collapseButton.classList.remove("border-secondary");
      collapseButton.classList.remove("content-start");
      if (additionalOptions.moodNamePair) {
        const moodName = additionalOptions.moodNamePair.moodInput.value;
        additionalOptions.moodNamePair.moodLabel.innerText = `(${(moodName) ? moodName : ""})`;
        additionalOptions.moodNamePair.moodLabel.hidden = false;
      }
    }

    collapseButton.innerHTML = (collapseButton.innerHTML === "▶") ? "▼" : "▶";
    elementToHide.hidden = (collapseButton.innerHTML === "▶") ? true : false;
    if (buttonHolder instanceof HTMLElement) {
      buttonHolder.hidden = (collapseButton.innerHTML === "▶") ? true : false;
    }

    collapseButton.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });


  }
  
  const activateButtonFold = (collapseButton:HTMLDivElement) => {
    if (collapseButton.innerHTML === "▼") {
      collapseButton.click();
    }
  }

  const deactivateButtonFold = (collapseButton:HTMLDivElement) => {
    if (collapseButton.innerHTML === "▶") {
      collapseButton.click();
    }
  }

  const applyCollapseButtonsToMoodSubsections = (titlePrefix:string) => {
    const titleSuffix = `__title`;

    const subsectionTitles = [
      `${titlePrefix}_captions${titleSuffix}`,
      `${titlePrefix}_denial${titleSuffix}`,
      `${titlePrefix}_subliminal-messages${titleSuffix}`,
      `${titlePrefix}_notifications${titleSuffix}`,
      `${titlePrefix}_prompts${titleSuffix}`,
      `${titlePrefix}_web${titleSuffix}`,
    ];

    for (const subtitle of subsectionTitles) {
      const titleHolderElement = document.getElementById(subtitle) as HTMLDivElement;
      
      let holderElement;
      let elementToHide;
      const additionalOptions:CollapseButtonOptions = {
        reparent: ReparentMode.MOOD_SUBTITLE 
      }

      if(titleHolderElement.dataset.moved !== "moved") {
        holderElement = titleHolderElement.parentElement?.parentElement!
        elementToHide = titleHolderElement.parentElement!;
        applyCollapseButton(holderElement, elementToHide, additionalOptions);
      }
    }
  }

  const handleArrayChangeClick = (button:HTMLButtonElement) => {
    // looks like if a reorder button would do nothing, it is disabled by RJSF, so we don't have to handle those cases
    if( button.id && ( ( button.id.endsWith("__moveDown")) || button.id.endsWith("__moveUp") || button.id && button.id.endsWith("__remove"))) {
      const [fieldName, buttonOperation] = button.id.split("__");
      const isReorderOperation = (buttonOperation === "moveDown" || buttonOperation === "moveUp");
      const isMoveDown = (isReorderOperation && buttonOperation === "moveDown");

      let index:number;

      // need to use this because of how React handles state in callbacks so we don't get "stale" state
      const colArrStates = colArrStatesRef.current;

      if (fieldName.startsWith("root_corruption_levels_")) {
        index = parseInt(fieldName.split("root_corruption_levels_")[1]);
        if(isReorderOperation) {
          reorderColArray(colArrStates.corruptionLevelCols, setCorruptionLevelCols, index, isMoveDown);
        }
        else {
          removeFromColArray(colArrStates.corruptionLevelCols, setCorruptionLevelCols, index);
        }
      }
      else if (fieldName.startsWith("root_index_moods_")) {
        index = parseInt(fieldName.split("root_index_moods_")[1]);
        if(isReorderOperation) {
          reorderColArray(colArrStates.moodCols, setMoodCols, index, isMoveDown);
        }
        else {
          removeFromColArray(colArrStates.moodCols, setMoodCols, index);
        }
      }
      else {
        console.log(`pattern not expected!`);
        return;
      }
    }
  }

  const reorderColArray = (colArrState:string[], colArrStateSetter:React.Dispatch<React.SetStateAction<string[]>>, index:number, isMoveDown:boolean) => {
    const swapOffset = (isMoveDown) ? 1 : -1;
    const swapIndex = index + swapOffset;
    const newColArr = [...colArrState];

    // swap col
    const tempCol:string = newColArr[index];
    newColArr[index] = newColArr[swapIndex];
    newColArr[swapIndex] = tempCol;

    colArrStateSetter(newColArr);
  }

  const removeFromColArray = (colArrState: string[], colArrStateSetter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    const newColArr = [...colArrState];
    const deletedCol = newColArr.splice(index, 1)[0];
    newColArr.push(deletedCol);
    colArrStateSetter(newColArr);
  }

  const applyMoodColChanges = (formDataToUse:any = formData) => {
    const numMoods = formDataToUse?.index?.moods?.length;

    const indexDefaultTitleHolderElement = document.getElementById("root_index_default__title");

    // if this exists, then we know elements in the index section have been rendered before
    if(indexDefaultTitleHolderElement)
    {
      for (let i = 0; i < numMoods; i++) {
        const titlePrefix = `root_index_moods_${i}`;
        const titleSuffix = `__title`;
        const rootMoodDiv = document.getElementById(`${titlePrefix}${titleSuffix}`)!;
        const rootDivSibling = rootMoodDiv.nextSibling as HTMLDivElement;
  
        const titleElement = rootMoodDiv.children[0]!;
        const moodNameInputElement = rootDivSibling.children[0]!.children[0]!.children[0]!.children[1]!.children[1]!.children[0];
        let moodLabelElement = titleElement.nextElementSibling!;

        // create the element and add it to document if it doesn't exist yet
        if(moodLabelElement.tagName !== "P") {
          moodLabelElement = document.createElement("p");
          moodLabelElement.className = "text-base ";
          titleElement.insertAdjacentElement("afterend", moodLabelElement);
        }

        const moodNamePair = {
          moodInput: moodNameInputElement as HTMLInputElement,
          moodLabel: moodLabelElement as HTMLParagraphElement
        }

        const fieldsetElement = rootMoodDiv.parentElement?.parentElement?.parentElement?.parentElement! as HTMLFieldSetElement;
  
        applyCollapseButton(fieldsetElement, rootDivSibling, {moodNamePair:moodNamePair});
  
        // now apply collapse button to subsections of the mood section
        applyCollapseButtonsToMoodSubsections(titlePrefix);
        fieldsetElement.style.backgroundColor = genBackgroundCol(i, useLightMode, true);
      }
    }
  }

  const applyCorruptionColChanges = (formDataToUse:any = formData) => {
    const numLevels = formDataToUse?.corruption?.levels?.length;

    // can only do these if elements have been rendered. So generate flag needs to be true
    if(formDataToUse?.corruption?.generate) {
      for (let i = 0; i < numLevels; i++) {
        const titlePrefix = `root_corruption_levels_${i}`;
        const titleSuffix = `__title`;
        const rootLevelDiv = document.getElementById(`${titlePrefix}${titleSuffix}`)!;
  
        const titleElement = rootLevelDiv.children[0]! as HTMLElement;
        const newTitle = titleElement.innerHTML.replaceAll(/[0-9]/g, "").trim() + ` ${i+1}`;
        titleElement.innerHTML = newTitle;
  
        let fieldsetElement;
        fieldsetElement = titleElement.closest<HTMLFieldSetElement>("fieldset")!;
        const corruptionElementToHide = fieldsetElement.children[0] as HTMLElement;
  
        const additionalOptions:CollapseButtonOptions = {
          // useExplicitSizing:true,
          elementWithTitleIDForLoaderButtons:rootLevelDiv,
          reparent: ReparentMode.CORRUPTION_TOP
        };

        applyCollapseButton(fieldsetElement, corruptionElementToHide!, additionalOptions);
        fieldsetElement.style.backgroundColor = genBackgroundCol(i, useLightMode, false);
  
        // now apply collapse button for the one subtitle
        setCollapseButtonAboveTitle(`${titlePrefix}_config__title`);
      }
    }
  }

  const applyColChanges = (newFormData:any, fieldID:string|undefined) => {
    if (fieldID === "root_corruption_levels" || fieldID === "root_corruption_generate")
    {
      applyCorruptionColChanges(newFormData);
    }
    else if(fieldID === "root_index_generate") {
      // this is for the root_index_default
      
      // only try to edit collapse buttons if they're going to be visible
      if(newFormData.index.generate) {
        setCollapseButtonAboveTitle("root_index_default__title");
        applyCollapseButtonsToMoodSubsections("root_index_default");
      }
      // still apply mood changes!
      applyMoodColChanges(newFormData);
    }
    else if (fieldID === "root_index_moods")
    {
      applyMoodColChanges(newFormData);
    }
  }

  const handleChange = (changeEvent: IChangeEvent<any, RJSFSchema, any>, fieldID:string|undefined, forcedFormData?:any) => {

    // set initial value of newFormData based on if we have a real change event or if we forced a fake one
    const newFormData = (forcedFormData) ? forcedFormData : changeEvent.formData;
    
    // this should make changes to the formData
    corruptionLevelDefaultsApplyManager(newFormData, fieldID);
    applyColChanges(newFormData, fieldID);

    if (newFormData?.index.generate)
    {
      setFormIndexGenerate(true);
      if(newFormData?.index?.moods?.length > 0)
      {
        
        const mdNames = newFormData?.index?.moods?.map((moodObj: any) => moodObj.mood);
        if (mdNames && mdNames.every((mdName: any) => { if (mdName) { return true } else { return false } })) {
          
          const arraysEqualShallowObj = arraysEqualShallow(mdNames, moodNames);
          if (! arraysEqualShallowObj.isEqual) {

            const changeIndex = arraysEqualShallowObj.unequalIndex;
            const oldMoodName = moodNames[changeIndex];
            const newMoodName = mdNames[changeIndex];

            if(newFormData.hasOwnProperty("corruption") && newFormData.corruption.hasOwnProperty("levels") && newFormData.corruption.levels.length > 0) {
              for(const levelObj of newFormData.corruption.levels) {
                const addMoodsArr = levelObj["add-moods"];
                const removeMoodsArr = levelObj["remove-moods"];

                for (let i = 0; i < addMoodsArr?.length; i++) {
                  if (addMoodsArr[i] === oldMoodName) {
                    addMoodsArr[i] = newMoodName;
                  }
                }

                for (let i = 0; i < removeMoodsArr?.length; i++) {
                  if (removeMoodsArr[i] === oldMoodName) {
                    removeMoodsArr[i] = newMoodName;
                  }
                }
              }
            }

            setMoodNames(mdNames);
          }
        }
      }
      else
      {
        if (moodNames.length > 0) {
          console.log(`here because form data moods length is 0, so handleChange wants to clear the moodNames state`)
          setMoodNames([]);
          setDefaultFormSchema();
        }
      }
    }
    else
    {
      // there was switch from true to false
      if(formIndexGenerate)
      {
        setDefaultFormSchema();
      }

      setFormIndexGenerate(false);
    }

    setFormData(newFormData); //set all changes to form data
  }

  const copyOutputToKeyboard = () => {
    navigator.clipboard.writeText(yamlOutput);
    alert("YAML Output copied to clipboard!");
  }

  const handleDownload = () => {
    const blob = new Blob([yamlOutput], {type: "text/yaml"});

    const url = URL.createObjectURL(blob);

    // create temp anchor
    const tempAnchor = document.createElement("a");
    tempAnchor.href = url;

    // uncomment this if we want custom names for downloaded yaml. then edit what tempAnchor.download is set to
    // let rawPackName = formData?.info?.name;
    // if(!rawPackName) {
    //   rawPackName = "pack";
    // }
    // const fileName = lodash.camelCase(rawPackName);

    tempAnchor.download = `pack.yml`;

    // trigger download
    document.body.appendChild(tempAnchor);
    tempAnchor.click();
    
    // clean up
    document.body.removeChild(tempAnchor);
    URL.revokeObjectURL(url);
  }

  const handleSubmit = ({ formData }: any) => {

    collapseButtonsGlobal.forEach((collapseButton) => {
      deactivateButtonFold(collapseButton);
    });
    // don't clean original data in case user wants to make further changes

    // create deep copy of form data so that user can keep making changes afterwards
    const submitData = JSON.parse(JSON.stringify(formData));

    const cleanData = cleanFormData(submitData);
    const yamlStr = stringify(cleanData, {
      // no custom yaml options yet...
    });
    setYamlOutput(yamlStr);
    setInitSubmitHappened(true);

    setTimeout(() => {
      setIsLoaderActive(false);
      if(outputSectionRef.current) {
        outputSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };

  const handlePackYmlUpload = (file:File) => {
    if(!file)
    {
      alert("File invalid");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (ev) => {
      try{
        const yamlText = ev.target?.result as string;
        const parsedData = parse(yamlText);

        reintroduceFormFlags(parsedData);
        removeEmptyArgsFromImportData(parsedData);
        setFormData(parsedData); //prefill the form
        setIsLoaderActive(false);
        setFormDataJustUploaded(true);
      }
      catch(err)
      {
        setIsLoaderActive(false);
        alert("Failed to parse YAML");
        console.error("Failed to parse YAML: " + err);
      }
    };

    setIsLoaderActive(true);
    fileReader.readAsText(file);
  }
  
  const onClickGeneratePack = () => {
    setIsLoaderActive(true);
    setTimeout(() => {
      collapseButtonsGlobal.forEach((collapseButton) => {
        deactivateButtonFold(collapseButton);
      });

      setTimeout(() => {
        formRef.current?.submit();
      }, 0);
    }, 0);

  }

  return (
    <>
      {/* use dracula theme for dark mode and cmyk theme for light mode */}
      <div data-theme={(useLightMode) ? "cmyk" : "dracula"} style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>

        {shortcutButtonsEnabled ? (
          <div
            id="action-button-holder"
            className={clsx(`
            fixed
            z-3
            top-0
            right-0
            m-4
            flex
            max-w-25vw
          `)}
          >
            <ActionButton
              actionCallback={onClickGeneratePack}
              mainText="Generate pack.yml"
              borderCol="success"
            />
            <ActionButton
              actionCallback={() => {
                setInfoModalOpen(true);
              }}
              mainText="🛈"
              textSize="3xl"
              subText="Info"
              borderCol="secondary"
            />
          </div>
        )
        :
        (
          <div></div>
        )}

        <InfoModal isOpen={infoModalOpen} setIsOpen={setInfoModalOpen}/>

        <h1
          className={clsx(`
            text-primary 
            font-bold
          `)}
        >
          Edgeware++ <br/>Pack Settings Maker <br/>(EPSM)
        </h1>

        <PackFileUploadZone 
          handleFileUpload={handlePackYmlUpload} 
        />

        <SpinLoader loaderVisible={isLoaderActive}/>

        <Form 
          ref={formRef}
          schema={formSchema} 
          uiSchema={uiSchema} 
          onSubmit={handleSubmit} 
          onChange={(formData, fieldID) => handleChange(formData, fieldID)}
          formData={formData}
          validator={validator}
          >
        </Form>
        <div className="flex justify-center"> 
          <ActionButton 
            actionCallback={onClickGeneratePack}
            mainText={"Generate pack.yml"} 
            borderCol={"success"}
          />
        </div>
        <ToolTipPatcher/>
        {(initSubmitHappened) ?
          (
        <section ref={outputSectionRef} id="output-section">
          <br/>
          <hr className='border-secondary'/>
          <br/>
          <hr className='border-secondary'/>
          <br/>
          <hr className='border-secondary'/>
          <br/>
          {(initSubmitHappened) ? 
            (
              <div
                onClick={handleDownload}
                className={clsx(`
                  btn
                  p-4
                  bg-base-300
                  hover:bg-primary
                  border-4
                  border-secondary
                  hover:border-success
                  font-bold
                  text-xl
                `)}
              >
                DOWNLOAD pack.yml 
              </div>
            )
            :
            (
              <div></div>
            )
          }
          <br/>
          <br/>
          <pre style={
            {
              background: (useLightMode) ? "#f4f4f4" : "#121212",
              padding: "1rem",
              overflowX: "auto",
              textAlign: "left",
              position: "relative"
            }
          }>
            {(initSubmitHappened) ? (
              <div
                className={clsx(`
                  z-1
                  top-5
                  right-5
                  absolute
                  rounded-full
                  px-4
                  py-1
                  border-4
                  border-primary
                  bg-base-200
                  hover:bg-base-100
                  hover:border-success
                  opacity-65
                  hover:opacity-100
                  cursor-pointer
                  hover:font-bold
                `)}
                onClick={copyOutputToKeyboard}    
              >
                Copy
              </div>
            )
            :
            (
              <div></div>
            )}
            <code>{yamlOutput}</code>
          </pre>
        </section>
          )
          :
          (
            <div></div>
          )
        }
      </div>
    </>
  )
}

export default App
