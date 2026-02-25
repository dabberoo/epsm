import React, { useCallback } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import {clsx} from "clsx";

const PackFileUploadZone = ({handleFileUpload}) => {
    return(
        <Dropzone 
          onDrop={acceptedFiles => handleFileUpload(acceptedFiles[0])}
          accept={{
            'application/x-yaml': ['.yaml', '.yml'],  
          }}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive}) => (
            <section>

              <div 
                {...getRootProps()}
                className={
                  clsx(`
                    rounded-2xl
                    p-12
                    m-8
                    bg-base-200
                    hover:bg-base-100
                    hover:border-secondary
                  `,
                  isDragActive
                  ?
                  `
                    border-secondary
                    border-solid
                    border-4
                    bg-primary
                  `
                  :
                  `
                    border-primary
                    border-dashed
                    border-4
                  `
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
                   Drag in or click to upload a pack.yml file
                </p>
              </div>
            </section>
          )}
        </Dropzone>
    );
}

export default PackFileUploadZone;