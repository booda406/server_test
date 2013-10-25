class ChgIdToImages < ActiveRecord::Migration
  def change
  	rename_column :images, :worker_id, :post_id
  end
end
