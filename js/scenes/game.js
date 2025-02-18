const CANDY_FALVORS = ['MoraAzul', 'Limon', 'Mora', 'Mango', 'Fresa'];

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
        // setTimeout(() => { this.scoreFinder(); }, 1000);
        
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
                                // console.log(result.movement);
                                mContext.scoreFinder();

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
                        resolve({"moved": moved, "movedTo": target, "movement": "top"});
                    }
                }, 4);
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
                        resolve({"moved": moved, "movedTo": target, "movement": "down"});
                    }
                }, 4);

            }else if (noMovement){
                resolve({"moved": null, "movedTo": null, "movement": null});
            }

            if (!noMovement){
                this.swap(candies, moved.key, target.key);
            }
        });
    }

    swap(arr, index1, index2) {
        let temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }

    scoreFinderVertical(){
        return new Promise((resolve, reject) => {
            let sameCandies = [], candy, promises = [];
    
            // Vertical
            for (let i = 0; i < candies.length; i++){
                candy = candies[i];
                sameCandies.push(candy);
                
                for(let j = (i + 1); j < candies.length; j+=1){
                    if (candy.flavor === candies[j].flavor && j % 4 != 0){
                        sameCandies.push(candies[j]);
                    }else {
                        break;
                    }
                }
                
                if (sameCandies.length > 2){
                        promises.push(new Promise((resolve) => {
                            mContext.changeCandies(sameCandies)
                            .then((result) => {
                                resolve();
                            });
                        }));
                    }
                    sameCandies = [];
            }

            Promise.all(promises).then(() => {
                resolve("Operación Vertical completada");
            });
        });
    }

    scoreFinder(){
        let promises = [];
        promises.push(mContext.scoreFinderVertical());
        promises.push(mContext.scoreFinderHorizontal());

        Promise.all(promises).then((result) => {
            console.log(result);
        });
    }

    scoreFinderHorizontal(){
        return new Promise((resolve, reject) => {
            let sameCandies = [], candy, promises = [];

            // Horizontal
            for (let i = 0; i < candies.length; i++){
                candy = candies[i];
                sameCandies.push(candy);
    
                for(let j = (i + 4); j < candies.length; j+=4){
                    if (candy.flavor === candies[j].flavor && j < 28){
                        sameCandies.push(candies[j]);
                    }else {
                        break;
                    }
                }
                
                if (sameCandies.length > 2){
                    promises.push(new Promise((resolve) => {
                        mContext.changeCandies(sameCandies)
                        .then((result) => {
                            resolve();
                        });
                    }));
                }
                sameCandies = [];
            }

            Promise.all(promises).then(() => {
                resolve("Operación Horizontal completada");
            });
        });
    }

    changeCandies(sameCandies) {
        return new Promise((resolve, reject) => {
            let promises = sameCandies.map((candy) => {
                return new Promise((resolve) => {
                    candy.alpha = 0;
                    let flavor = CANDY_FALVORS[this.getRandomInt(CANDY_FALVORS.length)];
                    candy.setTexture(flavor);
                    candy.flavor = flavor;
                    setTimeout(() => {candy.alpha = 1;resolve();}, 500);
                });
            });
            
            Promise.all(promises).then(() => {
                resolve('Candies changed');
            });
        });
    }
}
