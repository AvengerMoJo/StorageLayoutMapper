import { parseSync } from "svgson";

export function svgtojson( svgstring: string): any {
    let json = parseSync(svgstring);
    // return JSON.stringify(json, null, 2 );
    return prettyPrint(json);
}

export function prettyPrint( jsonstring: any): string {
    var jsonLine = /^( * )("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;

    var replacer = function(match: any, pIndent: any, pKey: any, pVal: any, pEnd: any) {
        var key = '<span class="json-key" style="color: brown">',
        val = '<span class="json-value" style="color: navy">',
        str = '<span class="json-string" style="color: olive">',
        r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';

        console.log('Match ' + match);
        return r + (pEnd || '');
    };
    return JSON.stringify(jsonstring, null, 3).replace(/&/g, '&amp;').
    replace(/\\"/g, '&quot;').replace(/</g, '&lt;').
    replace(/>/g, '&gt;').replace(jsonLine, replacer);
}
