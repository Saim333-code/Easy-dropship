import { app } from "@/app/_private/firebaseConfig";
import { getFirestore,collection,getDocs} from "firebase/firestore";
import { NextResponse } from "next/server";
export async function GET() {
    const db=getFirestore(app);
    const userCollection = collection(db, 'users');
    const snapshot = await getDocs(userCollection);

    const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    let userData=users.map(user=>({
        id:user.id,
        Name:user.Name,
        Email:user.Email
    }));


    // console.log(userData)
    // console.log("user Hit the api")

    return NextResponse.json({
        Result:"succeess",
        Data:userData

    },{
        status:201
    })
}
/*[
    {
      id: '675ECyXKeZ6OfwHJfkeY',
      confirmPassword: '12345678',
      BankAccountNumber: '1234567890',
      Address: 'CPO 1/16 MR III NRC E-8 ISLAMABAD',
      Brandname: 'jks',
      Name: 'saad',
      Password: '12345678',
      Mobile: '03102527460',
      Cardname: 'Muhammad Saad',
      Cnic: '1234567891011',
      Email: 'muhammadsd442@gmail.com',
      Bank: 'alhabib'
    },
    {
      id: 'eq0RvDGanmtA0CrosJ8q',
      Name: 'saif',
      Email: 'muhammadsd442@gmail.com',
      Bank: 'habib bank',
      Password: '12345678',
      Address: 'CPO 1/16 MR III NRC E-8 ISLAMABAD',
      Cnic: '1234567810119',
      confirmPassword: '12345678',
      Mobile: '03102527460',
      Cardname: 'Muhammad Saad',
      Brandname: 'Cotx',
      BankAccountNumber: 'znbznbz'
    }
  ]*/