
import React, { useCallback } from 'react';
import Dropzone, { useDropzone, type Accept } from 'react-dropzone';
import {clsx} from "clsx";

interface GenericFileUploadZoneProps{
    fileUploadHandler:any;
    classNameDefault:string;
    classNameDragActive:string;
    classNameDragInactive:string;
    acceptedFileTypes:Accept;
}

// incomplete for now
const GenericFileUploadZone = ({fileUploadHandler, classNameDefault, classNameDragActive, classNameDragInactive, acceptedFileTypes}:GenericFileUploadZoneProps) => {
    return(
        <Dropzone 
          onDrop={acceptedFiles => fileUploadHandler(acceptedFiles[0])}
          accept={acceptedFileTypes}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive}) => (
            <section>

              <div 
                {...getRootProps()}
                className={
                  clsx(classNameDefault,
                  isDragActive
                  ?
                  classNameDragActive
                  :
                  classNameDragInactive
                )
                }
                style={{
                  cursor: 'pointer',
                }}
              >
                <input {...getInputProps()} />
                <p
                    className={clsx(
                        `text-xl font-bold`
                    )}
                >
                   Drag in or click to upload a pack.yaml file
                </p>
              </div>
            </section>
          )}
        </Dropzone>
    );
}

export default GenericFileUploadZone;