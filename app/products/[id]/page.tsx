// export default function Product({ params }: { params: { id: string } }) {
//   return (
//     <div>
//       <h1>Product {params.id}</h1>
//     </div>
//   );
// }

export default async function Product(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return (
        <div>
            <h1>Product {id}</h1>
        </div>
    );
}