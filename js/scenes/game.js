const CANDY_FALVORS = ['Blueberry', 'Gauva', 'JavaPlum', 'Mango', 'Strawberry'];

// POSITIONS
const CANDY_SPACING = 175;

let candies = [];
let candy;
let allowMove = true;

let mContext;

export class Game extends Phaser.Scene {
    constructor ()
    {
        super('Game');
    }
    
    init() {
        let spacing_x = 100;
        let spacing_y = 100;
        let candy_count = 0;
        while (candy_count < 28){
            candy = this.physics.add.sprite(spacing_x, spacing_y, CANDY_FALVORS[this.getRandomInt(CANDY_FALVORS.length)]).setScale(.29);
            candy.key = candy_count;
            candy.flavor  = candy.texture.key;
            candies.push(candy);

            spacing_x += CANDY_SPACING;
            candy_count++;
            
            if (candy_count != 0 && candy_count % 4 === 0){
                spacing_y+= CANDY_SPACING;
                spacing_x = 100;
            }
        }
    }

    create (){
        mContext = this;
        let draggedCandy;
        
        candies.forEach((candy) => { 
            candy.setInteractive({ draggable: true , dropZone: true });

            candy.on('drag', function(pointer, localX, localY){
                draggedCandy = candy;
            }, mContext);

            candy.on('dragover', function(pointer, gameObject){
                if (draggedCandy !== gameObject){
                    if (allowMove){
                        allowMove = false;

                        this.candyMove(draggedCandy, gameObject)
                        .then((result) => {
                            if(result.movement){
                                this.scoreFinder();
                                // setTimeout(() => { 
                                //     return this.candyMove(result.movedTo, result.moved); 
                                // }, 500);
                            }
                        })
                        .then((reverseResult) => {
                            setTimeout(() => { allowMove = true; }, 800);
                        })
                        .catch((error) => {
                            console.error('Error en el movimiento:', error);
                        });
                    }
                }
            }, mContext);
        });
    } 

    update(){
        
    }

    getRandomInt(max){
        return Math.floor(Math.random() * max);
    }

    candyMove(moved, target){
        let movedX = moved.x;        
        let movedY = moved.y;
        let targetX = target.x;
        let targetY = target.y;   

        this.swap(candies, moved.name, target.name);
        // Movements
        let moveRight = false, moveLeft = false, moveUp = false, moveDown = false, noMovement = false;

        // Validate diagonals, and no movement events  
        if ((movedX < targetX && movedY < targetY) || 
            (movedX > targetX && movedY > targetY) ||
            ((movedX + movedY) - (targetX + targetY) < -175) ||
            ((movedX + movedY) - (targetX + targetY) > 175) ||
            (movedX === targetY && movedY === targetX) ||
            ((movedX - targetX) + (movedY - targetY) === 0)){
            noMovement = true;
        }
        else if (movedX < targetX){
            moveRight = true;
        }else if(movedX > targetX){
            moveLeft = true;
        }else if(movedY < targetY){
            moveDown = true;
        }else if(movedY > targetY){
            moveUp = true;
        }

        return new Promise((resolve, reject) => {
            if (moveRight){
                let movedXInterval = setInterval(() => {
                    moved.x += 3; 
                    if (Math.floor(moved.x) >= targetX || moved.x > 720)  {
                        clearInterval(movedXInterval);
                        moved.x = targetX;
                    }
                }, 4);
        
                let targetXInterval = setInterval(() => {
                    target.x -= 3; 
                    if (Math.floor(target.x) <= movedX || target.x < 0)  {
                        clearInterval(targetXInterval);
                        target.x = movedX;
                    }
                }, 4);

                resolve({"moved": moved, "movedTo": target, "movement": "right"});
            }else if (moveLeft){
                let movedXInterval = setInterval(() => {
                    moved.x -= 3; 
                    if (Math.floor(moved.x) <= targetX || moved.x > 720)  {
                        clearInterval(movedXInterval);
                        moved.x = targetX;
                    }
                }, 4);
        
                let targetXInterval = setInterval(() => {
                    target.x += 3; 
                    if (Math.floor(target.x) >= movedX || target.x < 0)  {
                        clearInterval(targetXInterval);
                        target.x = movedX;
                    }
                }, 4);
                resolve({"moved": moved, "movedTo": target, "movement": "left"});
            }else if (moveUp){
                let movedYInterval = setInterval(() => {
                    moved.y -= 3; 
                    if (Math.floor(moved.y) <= targetY || moved.y < 0){
                        clearInterval(movedYInterval);
                        moved.y = targetY;
                    }
                }, 4);
        
                let targetYInterval = setInterval(() => {
                    target.y += 3; 
                    if (Math.floor(target.y) >= movedY || target.y > 1280){
                        clearInterval(targetYInterval);
                        target.y = movedY;
                    }
                }, 4);
                resolve({"moved": moved, "movedTo": target, "movement": "top"});
            }else if (moveDown){
                let movedYInterval = setInterval(() => {
                    moved.y += 3; 
                    if (Math.floor(moved.y) >= targetY || moved.y > 1280){
                        clearInterval(movedYInterval);
                        moved.y = targetY;
                    }
                }, 4);
        
                let targetYInterval = setInterval(() => {
                    target.y -= 3; 
                    if (Math.floor(target.y) <= movedY || target.y < 0){
                        clearInterval(targetYInterval);
                        target.y = movedY;
                    }
                }, 4);
                resolve({"moved": moved, "movedTo": target, "movement": "down"});
            }else if (noMovement){
                resolve({"moved": null, "movedTo": null, "movement": null});
            }

        });
    }

    swap(arr, index1, index2) {
        let temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }

    scoreFinder(key = 0){ 
        let row = [];
        
        // Define candy rows to be checked
        for (let i = key; i < candies.length; i+=4){
            row.push(candies[i]);
        }   

        // Check if there are 3 candies with the same flavor
        let temp = row[0].flavor;   
        for (let i = 0; i < row.length; i++){
            if (row[i].flavor === temp){
                row[i].setScale(.35);
            }else {
                temp = row[i].flavor;
            }
            
        }   

        // if (key <= 3) 
        // this.scoreFinder(key+=1);
    }
}
