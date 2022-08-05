document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.document.querySelectorAll('.grid div')
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //The tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
    ]
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1],
    ]
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ]
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
    ]

//All the blocks in an array !new ones need to be added here when added above
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    console.log(theTetrominoes[0][0])

//random tetromino selection
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

//drawing tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

//undrawing tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition +index].style.backgroundColor =''
        })
    }

//Spawning Tetromino movement
 //   timerId = setInterval(moveDown, 1000)

//Assigning key operations/functions
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

//movedown function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

//Freeze function
    function freeze () {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //starts a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

//Move left function of Tetromino unless at edge (BONK, bad Doggo shall not Pass)
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1
        }
        draw()
    }

//moves the tetromino right, unless at the edge or at blockage (bonk, You Shall Not Pass)
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1
        }
        draw()
    }

//Tetromino trying to break the game? Boom this fixes it: WALLS
    function isAtRightEdge(){
        return current.some(index=> (currentPosition + index + 1) % width === 0)
    }

    function isAtLeftEdge(){
        return current.some(index=> (currentPosition + index) % width ===0)
    }

    function checkRotatedPosition(P){
        P = P || currentPosition
        if ((P+1) % width < 4) {
            if(isAtRight()) {
                currentPosition +=1
                checkRotatedPosition(P)
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -=1
                checkRotatedPosition(P)
            }
        }
    }



//make the tetromino do a thing as it moves down
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //Rotates from origin and back to origin
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    //Preview the next tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    //tetrominos that arent doing a thing
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //Showing the "up next" blocks
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //adding buttons!
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    //SCORE TIME
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


    //GAME OVER MAN D:
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }








})