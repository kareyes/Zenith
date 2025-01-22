function twoSum(nums: number[], target: number): number[] {
    let arr: number[] = []
    nums.map((val, i)=>{
        let currentInd = nums.findIndex((currVal, x) =>{
            if(x != i && currVal === target - val && !arr.includes(x)){
                return true
            }
        })
        if(currentInd !== -1 )
            arr.push(currentInd)

    })

    return  arr.sort()
}