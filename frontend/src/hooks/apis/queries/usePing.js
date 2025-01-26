import { useQuery } from '@tanstack/react-query';
import { pingApi } from '../../../apis/ping.js';

export default function usePing() {
    const { isLoading, isError, data, error } =  useQuery({
        queryFn: pingApi,
        queryKey: 'ping',
        staleTime: 10000
    });

    return {
        isLoading,
        isError,
        data,
        error
    };
}

/*
StaleTime: The duration until a query transitions from fresh to stale. 
As long as the query is fresh, data will always be read from the cache only - no network request will happen! 
If the query is stale (which per default is: instantly), you will still get data from the cache, 
but a background refetch can happen under certain conditions.

CacheTime: The duration until inactive queries will be removed from the cache. 
This defaults to 5 minutes. Queries transition to the inactive state 
as soon as there are no observers registered, 
so when all components which use that query have unmounted.




*/


//explaination of Query and mutation
//Queries are used to fetch data from the server i.e. read data from the server , uses GET request.
//Mutations are used to change data on the server i.e. write data to the server , uses POST,PUT,DELETE request.


