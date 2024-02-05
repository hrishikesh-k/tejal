declare module '@netlify/cache-utils' {
  declare const bindOpts : (options : {
    cacheDir : string
  }) => {
    list : (options? : {
      cwd? : string
      depth? : number
    }) => Promise<Array<string>>
    restore : (paths : Array<string>, options? : {
      cwd? : string
    }) => Promise<boolean>
    save : (paths : Array<string>, options? : {
      cwd? : string
      digests? : Array<string>
      ttl? : number
    }) => Promise<boolean>
  }
}