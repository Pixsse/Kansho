import type { Ref } from 'vue'

//#region Load Video
/**
 * Loads a video file into a ref and resets the subtitle ref.
 *
 * @param {File} file - The video file selected by the user.
 * @param {import('vue').Ref<string>} videoRef - Vue ref that will hold the video’s Object URL.
 * @param {import('vue').Ref<string>} trackRef - Vue ref that will hold the subtitle track’s Object URL.
 * @returns {void}
 *
 * @example
 * ```ts
 * const videoUrl = ref('');
 * const trackUrl = ref('');
 *
 * // When a user selects a file:
 * loadVideo(file, videoUrl, trackUrl);
 * // videoUrl.value -> 'blob:...'
 * // trackUrl.value -> ''
 * ```
 */
export function loadVideo(file: File, videoRef: Ref<string>, trackRef: Ref<string>) {
  videoRef.value = URL.createObjectURL(file)
  trackRef.value = ''
}
//#endregion



//#region Load Subtile
/**
 * Loads a subtitle file into a ref.
 *
 * @param {File} file - The subtitle file selected by the user (either .srt or .vtt).
 * @param {import('vue').Ref<string>} trackRef - Vue ref that will hold the subtitle track’s Object URL.
 * @returns {void}
 *
 * @example
 * ```ts
 * const trackUrl = ref('');
 *
 * // When a user selects a subtitle file:
 * loadSubtitle(file, trackUrl);
 * // trackUrl.value -> 'blob:...'
 * ```
 */
export async function loadSubtitle(file: File, trackRef: Ref<string>): Promise<void> {
  // 1) Lecture brute
  const buffer = await file.arrayBuffer()
  // 2) Décodage en UTF-8 (on enlève le BOM si présent)
  const decoder = new TextDecoder('utf-8')
  let text = decoder.decode(buffer).replace(/^\uFEFF/, '')

  // 3) Si c'est du SRT, on convertit en VTT
  if (file.name.toLowerCase().endsWith('.srt')) {
    // supprime fins de ligne Windows, convertit toutes les virgules sur les timecodes
    text = text
      .replace(/\r+/g, '')                                      // CRLF → LF
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')         // hh:mm:ss,mmm → hh:mm:ss.mmm
    // ajoute l’en-tête WebVTT
    text = 'WEBVTT\n\n' + text
  }
  // 4) Création du blob VTT et URL
  const blob = new Blob([text], { type: 'text/vtt' })
  trackRef.value = URL.createObjectURL(blob)
}
//#endregion
