
import "./InventoryTable.css";

function InventoryTable({ inventory }) {
  return (
    <div className="inventory-panel">
      <div className="inventory-panel-header">
        <div>
          <h2 className="inventory-panel-title">
            Product quantities
          </h2>
          <p className="inventory-panel-description">
            Total quantity across current orders
          </p>
        </div>

        <span className="inventory-live-label">
          <span className="inventory-live-dot" />
          Live updates
        </span>
      </div>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity ordered</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="inventory-product-cell">
                    <span className="inventory-product-icon">
                      <span aria-hidden="true">✦</span>
                    </span>

                    <span>{item.name}</span>
                  </div>
                </td>

                <td>
                  <span className="inventory-quantity">
                    {Number(
                      item.quantity_ordered ?? 0
                    ).toLocaleString("en-IN", {
                      maximumFractionDigits: 3,
                    })}

                    <span className="inventory-quantity-unit">
                      kg
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;
