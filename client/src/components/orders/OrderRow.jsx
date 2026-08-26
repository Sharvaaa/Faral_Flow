function OrderRow({ item, index, onRemove }) {
  return (
    <tr className="border-b">
      <td className="py-3">
        {item.productName}
      </td>

      <td className="py-3">
        {item.packetCount}
      </td>

      <td className="py-3">
        {item.packetSize} {item.packetUnit}
      </td>

      <td className="py-3">
        ₹{item.price}/kg
      </td>

      <td className="py-3">
        ₹{item.total.toFixed(2)}
      </td>

      <td className="py-3">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export default OrderRow;