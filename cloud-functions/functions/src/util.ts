export const setCorns = (req:any, res:any) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
         // Send response to OPTIONS requests
         res.set('Access-Control-Allow-Methods', 'GET');
         res.set('Access-Control-Allow-Headers', 'Content-Type');
         res.set('Access-Control-Max-Age', '3600');
         res.status(204).send('');
       return false;
    }
    else{
        return true;
    }
};
