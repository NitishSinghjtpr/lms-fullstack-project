export function isEmail(string){
    return string.match(/[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      )
        
}

export function isValidPassword(string){
    return string.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/)
     
}




