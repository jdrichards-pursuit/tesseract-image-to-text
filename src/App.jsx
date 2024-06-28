import { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js'
import './App.css'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textResult, setTextResult] = useState('')
  const [editedRecipe, setEditedRecipe] = useState({
    title: '',
    instructions: '',
  })
  const [recipes, setRecipes] = useState([])

  const convertImageToText = async () => {
    const worker = await createWorker('eng')
    const ret = await worker.recognize(selectedImage)
    setTextResult(ret.data.text)
    setEditedRecipe({ ...editedRecipe, instructions: ret.data.text })

    await worker.terminate()
  }

  useEffect(() => {
    if (selectedImage) convertImageToText()
  }, [selectedImage])

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    } else {
      setTextResult('')
      setSelectedImage(null)
    }
  }

  const handleEditRecipe = (e) => {
    setEditedRecipe({ ...editedRecipe, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setRecipes([editedRecipe, ...recipes])
    setEditedRecipe(null)
    setTextResult('')
    setSelectedImage(null)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 30,
      }}
    >
      {console.log('selectedImage', selectedImage)}
      {console.log('textResult', textResult)}
      {console.log('editedRecipe', editedRecipe)}
      {console.log('recipes', recipes)}
      {!selectedImage && (
        <div style={{ marginBottom: 20, fontSize: '1.5rem' }}>
          <form>
            <label htmlFor="upload">
              Upload Image
              <input
                style={{ marginLeft: 10 }}
                type="file"
                id="upload"
                accept="image/*"
                onChange={handleChangeImage}
              />
            </label>
          </form>
        </div>
      )}

      <div>
        {selectedImage && (
          <div>
            <h2>Image</h2>
            <img
              style={{ height: 600 }}
              src={URL.createObjectURL(selectedImage)}
              alt="selectedImage"
            />
          </div>
        )}
      </div>
      <div>
        {textResult && (
          <div style={{ width: 750, fontSize: '1.5rem' }}>
            <h2>Recipe To Edit</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">
                <input
                  style={{
                    height: 30,
                    width: 350,
                    marginBottom: 10,
                    padding: 10,
                  }}
                  onChange={handleEditRecipe}
                  placeholder="Add Your Title Here"
                  value={editedRecipe.title}
                  type="text"
                  id="title"
                  name="title"
                />
              </label>
              <label htmlFor="instructions">
                <textarea
                  style={{ padding: 15 }}
                  cols="100"
                  rows="20"
                  onChange={handleEditRecipe}
                  name="instructions"
                  id="instructions"
                  value={editedRecipe.instructions}
                ></textarea>
              </label>
              <button>Save Recipe</button>
            </form>
          </div>
        )}
      </div>
      <div>
        {!selectedImage && recipes.length > 0 && (
          <>
            <h2>Recipes</h2>
            {recipes.map((recipe, idx) => (
              <div key={idx} style={{ marginBottom: 10, padding: 10 }}>
                <h2>{recipe.title}</h2>
                <p>{recipe.instructions}</p>
                <hr style={{ marginTop: 10 }} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default App
