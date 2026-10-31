"use client";
import { useLang, VIDEOS_LIBRES } from "../../lib/i18n";

export default function Videos() {
  const { t, lang } = useLang();
  return (
    <section id="videos"><div className="wrap">
      <h2>{t.videos.title}</h2>
      <p className="lead">{t.videos.freeLead}</p>
      {VIDEOS_LIBRES.length === 0 ? (
        <p className="note">{t.videos.freeEmpty}</p>
      ) : (
        <div className="grid">
          {VIDEOS_LIBRES.map((v) => (
            <div className="vid-card" key={v.file || v.drive || v.id}>
              {v.file ? (
                <div className="vid-embed">
                  {/* Sans couverture, la vignette reste un rectangle noir tant
                      que le visiteur n'a pas lancé la lecture. */}
                  <video
                    src={v.file}
                    poster={v.file.replace("/videos/", "/videos/couvertures/").replace(".mp4", ".jpg")}
                    controls
                    preload="metadata"
                  />
                </div>
              ) : v.drive ? (
                <div className="vid-embed">
                  <iframe
                    src={`https://drive.google.com/file/d/${v.drive}/preview`}
                    title={v.title[lang]}
                    loading="lazy"
                    allow="autoplay"
                    allowFullScreen
                  />
                </div>
              ) : v.embed ? (
                <div className="vid-embed">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    title={v.title[lang]}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a className="vid-embed vid-link" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer">
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
                  <span className="vid-play" aria-hidden="true">▶</span>
                </a>
              )}
              <h3>{v.title[lang]}</h3>
              {!v.file && !v.drive && !v.embed ? <p className="note">{t.videos.onYoutube}</p> : null}
            </div>
          ))}
        </div>
      )}
    </div></section>
  );
}
