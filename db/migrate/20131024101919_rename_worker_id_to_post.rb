class RenameWorkerIdToPost < ActiveRecord::Migration
  def change
  	rename_column :posts, :worker_id, :user_id
  end
end
