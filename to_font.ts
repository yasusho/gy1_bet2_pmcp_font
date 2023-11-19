import { generateFonts, FontAssetType, OtherAssetType } from 'fantasticon';
import * as fs from 'fs';
(async function() {
const fix_path = "glyphs";
const out_path = `fonts`;
const glyph_map: { [key: string]: number } = {};
const files = fs.readdirSync(`${fix_path}/`);
files.forEach((file, index) => {
  if (file.slice(-4) !== ".svg") return;
  {
    glyph_map[file[0]] = file.codePointAt(0)!;
    console.log(file[0], file.codePointAt(0)!.toString(16))
  }
});
if (!fs.existsSync(out_path)) {
  fs.mkdirSync(out_path);
}
generateFonts({
  inputDir: `${fix_path}/`,
  outputDir: `${out_path}/`,
  name: `gy1bet2`,
  fontTypes: [FontAssetType.TTF, FontAssetType.WOFF],
  assetTypes: [
    OtherAssetType.CSS,
    OtherAssetType.HTML,
    OtherAssetType.JSON,
   /* OtherAssetType.TS */ // The TS asset is buggy; remove
  ],
  fontHeight: 480,
  codepoints: glyph_map
}).then(results => {
  console.log(results);
  
  fs.readFile(`${out_path}/gy1bet2.html`, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    const result = replace_problematic_css(data);
    fs.writeFile(`${out_path}/gy1bet2.html`, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

  fs.readFile(`${out_path}/gy1bet2.css`, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    const result = replace_problematic_css(data);
    fs.writeFile(`${out_path}/gy1bet2.css`, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

});
})();

// CSS が壊れたり HTML でワーニングが出たりするやつを CSS と HTML から除く
function replace_problematic_css(data: string) {
  return data
    .replaceAll('U+', 'U-')
    .replaceAll('icon-!', 'icon-exclamation')
    .replaceAll('icon-,', 'icon-comma')
    .replaceAll('icon-(', 'icon-left-paren')
    .replaceAll('icon-)', 'icon-right-paren')
    .replaceAll('icon-[', 'icon-left-square-bracket')
    .replaceAll('icon-]', 'icon-right-square-bracket')
    .replaceAll('icon-{', 'icon-left-curly-brace')
    .replaceAll('icon-}', 'icon-right-curly-brace')
    .replaceAll("class='label'", `class="label"`)
  ;
}
