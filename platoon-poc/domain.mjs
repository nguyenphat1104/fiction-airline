export const seedFlights = [
  {id:'FA101',origin:'SGN',destination:'HAN',date:'2026-11-15',departure:'08:00',price:950000,seats:3},
  {id:'FA102',origin:'SGN',destination:'HAN',date:'2026-11-15',departure:'16:30',price:1200000,seats:2},
  {id:'FA201',origin:'HAN',destination:'DAD',date:'2026-11-15',departure:'10:15',price:780000,seats:2},
];
export function createAirline(seed=seedFlights) {
  const flights = new Map(seed.map(f=>[f.id,{...f}]));
  const bookings = new Map();
  const keys = new Map();
  let next=1;
  const fail=(status,message)=>({status,error:message});
  return {
    search({origin='',destination='',date=''}) {
      return [...flights.values()].filter(f=>(!origin||f.origin===origin.toUpperCase())&&(!destination||f.destination===destination.toUpperCase())&&(!date||f.date===date)).map(f=>({...f}));
    },
    reserve({flightId,passenger,idempotencyKey}) {
      if(typeof idempotencyKey!=='string'||!idempotencyKey.trim()) return fail(400,'idempotencyKey required');
      if(typeof passenger?.name!=='string'||passenger.name.trim().length<2||typeof passenger?.email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) return fail(400,'Valid passenger name and email required');
      if(keys.has(idempotencyKey)) {
        const previous=bookings.get(keys.get(idempotencyKey));
        if(previous.flightId!==flightId||previous.passenger.name!==passenger.name.trim()||previous.passenger.email!==passenger.email.trim()) return fail(409,'Idempotency key already used for a different request');
        return {status:200,booking:{...previous}};
      }
      const flight=flights.get(flightId);
      if(!flight) return fail(404,'Flight not found');
      if(flight.seats<=0) return fail(409,'No seats available');
      flight.seats-=1;
      const booking={id:`BK${String(next++).padStart(4,'0')}`,flightId,passenger:{name:passenger.name.trim(),email:passenger.email.trim()},status:'RESERVED'};
      bookings.set(booking.id,booking);keys.set(idempotencyKey,booking.id);
      return {status:201,booking:{...booking}};
    },
    pay(id,{scenario='success'}={}) {
      const booking=bookings.get(id);
      if(!booking) return fail(404,'Booking not found');
      if(booking.status==='CONFIRMED') return {status:200,booking:{...booking}};
      if(booking.status!=='RESERVED') return fail(409,'Booking cannot be paid');
      if(!['success','decline'].includes(scenario)) return fail(400,'Invalid payment scenario');
      if(scenario==='decline') return fail(402,'Mock payment declined; reservation remains held');
      booking.status='CONFIRMED';return {status:200,booking:{...booking}};
    },
    getBooking(id) {const b=bookings.get(id);return b?{status:200,booking:{...b}}:fail(404,'Booking not found');}
  };
}