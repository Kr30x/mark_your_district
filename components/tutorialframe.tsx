import React from 'react'

const TutorialFrame = () => {
  return (
    <div className="w-full max-w-3xl aspect-video">
      <iframe
        src="https://www.youtube.com/watch?v=sCFS_U7d9Do"
        title="Обучающий материал"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  )
}

export default TutorialFrame